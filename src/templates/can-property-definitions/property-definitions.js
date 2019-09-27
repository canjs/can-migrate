import makeDebug from 'debug';
import { typeConversions, find } from '../../../utils/typeUtils';
import { addImport } from '../../../utils/renameImport';
import { createMethod } from '../../../utils/classUtils';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-property-definitions/property-definitions:${file.path}`);
  const j = api.jscodeshift;

  return fileTransform(file, function (source) {
    const root = j(source);

    return find(root, 'ObjectExpression', function (props) {
      return props.forEach(prop => {
        const { nestedProp, propConversions, defaultLiteral } = prop.value.properties
          .reduce((acc, path) => {
            if ((path.value.type === 'Literal' || path.value.type === 'Identifier') && path.key.name.toLowerCase() === 'type') {
              acc.nestedProp = path;
            }
            if (path.value.type === 'Identifier' && path.key.name === 'Default') {
              acc.defaultLiteral = path;
            }
            if (['Type', 'serialize'].includes(path.key.name)) {
              acc.propConversions.push(path);
            }
            return acc;
          }, { nestedProp: null, propConversions: [], defaultLiteral: null });

        // Convert "types" to maybeConverts
        if (nestedProp) {
          const type = nestedProp.value.value || nestedProp.value.name;
          debug(`Converting property ${type}.`);
          nestedProp.value = typeConversions(type);
        }

        // Check for Type to be converted
        // Change serialize to enumerable
        propConversions.forEach(prop => {
          const updatedKey = prop.key.name === 'serialize' ? 'enumerable' : prop.key.name.toLowerCase();
          debug(`Converting key ${prop.key.name} -> ${updatedKey}`);
          prop.key.name = updatedKey;
        });

        /**
         * Convert default functions that are functions that return functions into top-level functions
         * class Bar extends ObservableObject {
         *   static get props() {
         *     return {
         *       items: {
         *         default () {
         *         	 return function () {
         *             return 'World!'
         *           }
         *         }
         *       }
         *     };
         *   }
         * };
         * Becomes:
         * class Bar extends ObservableObject {
         *   static get props() {
         *     return {
         *       items: {
         *         default () {
         *         	 return 'World!'
         *         }
         *       }
         *     };
         *   }
         * };
         */
        replaceDefaultFunction(j, 'FunctionExpression', j(prop));
        replaceDefaultFunction(j, 'ArrowFunctionExpression', j(prop));
        // Convert `Default: Todo` into
        // Default: {
        //   get default () {
        //     return new Todo()
        //   }
        // }
        if (defaultLiteral) {
          replaceDefaultFunction(j, 'Identifier', j(prop), { name: 'Default' });
        }

      /**
       * Convert async getters into async's
       * get (lastSet, resolve) {}
       * into
       * async (resolve, lastSet) {}
       */
      j(prop).find(j.FunctionExpression)
        .forEach(prop => {
          // Check for the get methods
          // The type must be property to avoid
          // BlockStatement error see #139
          if (prop.parentPath.value.type === 'Property' && prop.parentPath.value.key.name === 'get') {
            // We only want getters with 2 params
            if (prop.value.params.length === 2) {
              // Change the name
              prop.parentPath.value.key.name = 'async';
              // Reverse the prop order
              prop.value.params = prop.value.params.reverse();
            }
          }
        });

        // Add the import
        if (nestedProp) {
          // Ensure we only add the 'type' if we are on an import with ObservableArray, ObservableObject or StacheElement
          addImport(j, root, { importName: 'type', hasSiblings: ['ObservableArray', 'ObservableObject', 'StacheElement'] });
        }
      });
    })
    .toSource();
  });
}

function replaceDefaultFunction (j, type, root, opts = {}) {
  root.find(j[type], opts)
    .forEach(p => {
      // Only modify default function
      if (p.parentPath.value.key && p.parentPath.value.key.name === 'default') {
        // Check that we have multiple returns within this function expression
        const returns = j(p).find(j.ReturnStatement);
        // We only care if we have more than one return statement
        if (returns.length === 2) {
          // Get the inner return statement
          const inner = returns.at(0).get();
          // Replace the function with a function
          // should be get default () {}
          j(inner).replaceWith(inner.value.argument.body.body);
        } else {
          // Default to the function body
          let body = p.value.body;
          // If the body type isn't a blockStatement
          // wrap it in one
          if (body.type !== 'BlockStatement') {
            body = j.blockStatement([j.returnStatement(p.value.body)]);
          }
          // Replace the function with a getter
          j(p.parentPath).replaceWith(createMethod({
            j,
            name: 'default',
            method: false,
            blockStatement: body
          }));
        }
      } else if (p.value.name === 'Default') {
        // Replace with a getter
        j(p.parentPath).replaceWith(createMethod({
          j,
          name: 'default',
          method: false,
          blockStatement: [
            j.returnStatement(
              j.newExpression(j.identifier(p.parentPath.value.value.name), [])
            )
          ]
        }));
      }
    });
}

transformer.forceJavaScriptTransform = true;

export default transformer;
