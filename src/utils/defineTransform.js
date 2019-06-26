import { createClass, createMethod } from './classUtils';

// can-define transform util
// used to transform can-define/map & can-define/list
export default function defineTransform ({
  j,
  source,
  objectName,
  propertyName = 'extend',
  extendedClassName,
  debug = () => {}
} = {}) {
  return j(source)
  .find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: {
        name: objectName
      },
      property: {
        name: propertyName
      }
    }
  })
  .forEach(path => {
    let varDeclaration;
    let classPath;
    // Replace variable declarations with class def
    if (path.parentPath && path.parentPath.value && path.parentPath.value.type === 'VariableDeclarator') {
      varDeclaration = path.parentPath.value.id.name;
      classPath = path.parentPath.parentPath.parentPath;
    }

    let propDefinitionsArg = path.value.arguments.length === 1 ?
      path.value.arguments[0] :
      path.value.arguments[1];

    debug(`Replacing ${varDeclaration} with ${extendedClassName} class`);

    j(classPath).replaceWith(
      createClass({
        j,
        className: varDeclaration,
        body: [
          createMethod({
            j,
            method: false, // Want this to be a getter
            name: 'define',
            blockStatement: [j.returnStatement(propDefinitionsArg)],
            isStatic: true
          })
        ],
        extendedClassName
      })
    );

  })
  .toSource();
}
