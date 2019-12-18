import string from 'can-string';
import makeDebug from 'debug';
import getConfig from '../../../utils/getConfig';
import { createClass, createMethod } from '../../../utils/classUtils';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-stache-element:${file.path}`);
  const j = api.jscodeshift;
  const config = getConfig(options.config);
  const printOptions = options.printOptions || {};
  const extendedClassName = config.moduleToName['can-stache-element'];

  return fileTransform(file, function (source) {
    const root = j(source);
    var name;

    // Get the imported local name
    root.find(j.ImportDeclaration).filter(p => {
      return  p.parent.node.type === 'Program' &&
            p.get('specifiers', 0, 'type').value !== 'ImportNamespaceSpecifier' &&
                p.value.source.value === 'can' ||
                /\/\/unpkg.com\/can@5(\.[0-9]+)?(\.[0-9]+)?\/[a-z]+.mjs/.test(p.value.source.value);
    }).forEach(path => {
      path.value.specifiers.forEach((specifier) => {
        if (specifier.imported.name === 'Component') {
          if (specifier.local.name) {
            name = specifier.local.name;
          }
        }
      });
    });

    return root
      .find(j.CallExpression, {
        callee: {
          type: 'MemberExpression',
          object: {
            name: name ? name : 'Component'
          },
          property: {
            name: 'extend'
          }
        }
      })
      .forEach(path => {
        const props = {
          'view': {
            name: 'view',
            type: 'get',
            static: true,
            path: null
          },
          'ViewModel': {
            name: 'props',
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
        let varDeclarationPath;
        let varDeclarationName;

        // Loop over the properties to grab the ones we want to copy over
        path.value.arguments[0].properties
          .forEach(path => {
            if (props[path.key.name]) {
              props[path.key.name].path = path;
            } else if (path.key.name === 'tag') {
              tagName = path.value.value;
            }
          });

        // Replace variable declarations with class def
        if (path.parentPath && path.parentPath.value && path.parentPath.value.type === 'VariableDeclarator') {
          // Use the name of the variable as the component name
          varDeclarationName = path.parentPath.value.id.name;
          path = path.parentPath.parentPath.parentPath;
          varDeclarationPath = j(path);
        // `AssignmentExpression` used to check if the `Component` is being exported as created ie:
        // module.exports = Component.extend({ ... })
        } else if (path.parentPath && path.parentPath.value && path.parentPath.value.type === 'AssignmentExpression') {
          varDeclarationPath = j(path).closest(j.ExpressionStatement);
        } else {
          varDeclarationPath = j(path.parentPath);
        }

        const className = string.pascalize(varDeclarationName || tagName);

        debug(`Replacing ${className} with ${extendedClassName} class`);

        j(path).replaceWith(
          createClass({
            j,
            className,
            extendedClassName
          })
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
              methods.push(createMethod({
                j,
                method: prop.type === 'method',
                name: prop.name,
                blockStatement,
                isStatic: prop.static
              }));
            }
          }
        });

        // Append methods to main class
        path.value.body.body.push(...methods);

        // Add the customElements define
        varDeclarationPath.insertAfter(
          j.expressionStatement(
            j.callExpression(
              j.memberExpression(
                j.identifier('customElements'),
                j.identifier('define')
              ),
              [j.literal(tagName), j.identifier(className)]
            )
          )
        );
      })
      .toSource(printOptions);
    });
}

transformer.forceJavaScriptTransform = true;

export default transformer;
