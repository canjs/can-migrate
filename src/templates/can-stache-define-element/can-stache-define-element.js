// import getConfig from '../../../utils/getConfig';
// import renameImport from '../../../utils/renameImport';
// import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';

// TODO
// - add pascalise to `can-string`
// pascalise the className to ensure all classes are pascal case: fooBar === FooBar
// add transform.json for testing and copying files

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-stache-define-element:${file.path}`);
  const j = api.jscodeshift;
  const props = {
    'view': {
      name: 'view',
      type: 'get',
      static: true,
      path: null
    },
    'ViewModel': {
      name: 'define',
      type: 'get',
      static: true,
      path: null
    },
    'events': {
      name: 'connected',
      type: 'method',
      static: false,
      path: null
    }
  };
  const methods = [];
  let tagName;
  let varDeclaration;

  return j(file.source)
    .find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: {
          name: "Component"
        },
        property: {
          name: "extend"
        }
      }
    })
    .forEach(p => {
      p.value.arguments[0].properties
        .forEach(path => {
          if (props[path.key.name]) {
            props[path.key.name].path = path;
          } else if (path.key.name === 'tag') {
            tagName = path.value.value;
          }
        });
      })
    .forEach(path => {
      // Replace variable declarations with class def
      if (path.parentPath && path.parentPath.value && path.parentPath.value.type === 'VariableDeclarator') {
        varDeclaration = path.parentPath.value.id.name;
        path = path.parentPath.parentPath.parentPath;
      }

      debug(`Replacing ${varDeclaration ||tagName} with StacheDefineElement class`);

      j(path).replaceWith(
        j.classDeclaration(
          j.identifier(varDeclaration ||tagName),
          j.classBody([]),
          j.identifier("StacheDefineElement")
        )
      );

      Object.keys(props).forEach(key => {
        const prop = props[key];

        if (prop.path !== null) {
          const propPath = prop.path;
          let blockStatement;

          if (prop.type === 'get') {
            blockStatement = [
              j.returnStatement(propPath.value)
            ];
          } else if (prop.type === 'method') {
            blockStatement = [
              j.variableDeclaration('const', [
                j.variableDeclarator(j.identifier(propPath.key.name), propPath.value)
              ])
            ];
          }

          // Check if we have an existing method
          // in which case we want to push the variable declaration inside the existing method body
          const existingMethod = methods.find(p => p.kind === 'method' && p.key.name === prop.name);
          if (existingMethod) {
            existingMethod.value.body.body.push(...blockStatement);
          } else {
            // Otherwise create a new method definition
            methods.push(j.methodDefinition(
              prop.type,
              j.identifier(prop.name),
              j.functionExpression(null, [], j.blockStatement(blockStatement)),
              prop.static
            ));
          }
        }
      })

      // Append methods to main class
      path.value.body.body.push(...methods);

      // Add the customElements define
      j(varDeclaration ? path : path.parentPath).insertAfter(
        `customElements.define('${tagName}', ${varDeclaration || tagName})`
      )
    })
    .toSource();
}
