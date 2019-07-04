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
        const { nestedProp, propConversions } = prop.value.properties
          .reduce((acc, path) => {
            if (path.value.type === 'Literal' && path.key.name === 'type') {
              acc.nestedProp = path;
            }
            if (['Type', 'Default', 'serialize'].includes(path.key.name)) {
              acc.propConversions.push(path);
            }
            return acc;
          }, { nestedProp: null, propConversions: [] });

        // Convert "types" to maybeConverts
        if (nestedProp) {
          const type = nestedProp.value.value;
          debug(`Converting property ${type} -> ${typeConversions[type]}`);
          nestedProp.value = typeConversions[type];
        }

        // Check for Type && Default to be converted
        // Change serialize to enumerable
        propConversions.forEach(prop => {
          const updatedKey = prop.key.name === 'serialize' ? 'enumerable' : prop.key.name.toLowerCase();
          debug(`Converting key ${prop.key.name} -> ${updatedKey}`);
          prop.key.name = updatedKey;
        });

        /**
         * Convert default functions that are functions that return functions into top-level functions
         * class Bar extends DefineObject {
         *   static get define() {
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
         * class Bar extends DefineObject {
         *   static get define() {
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

      /**
       * Convert async getters into async's
       * get (lastSet, resolve) {}
       * into
       * async (resolve, lastSet) {}
       */
      j(prop).find(j.FunctionExpression)
        .forEach(prop => {
          // Check for the get methods
          if (prop.parentPath.value.key.name === 'get') {
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
        // Ensure we only add the 'type' if we are on an import with DefineArray, DefineObject or StacheDefineElement
        addImport(j, root, { importName: 'type', hasSiblings: ['DefineArray', 'DefineObject', 'StacheDefineElement'] });
      });
    })
    .toSource();
  });
}

function replaceDefaultFunction (j, type, root) {
  root.find(j[type])
    .forEach(p => {
      // Check that we have multiple returns within this function expression
      const returns = j(p).find(j.ReturnStatement);
      // We only care if we have more than one return statement
      if (returns.length === 2) {
        // Get the inner return statement
        const inner = returns.at(0).get();
        // Replace the function with a getter function
        // should be get default () {}
        j(p.parentPath).replaceWith(createMethod({
          j,
          name: 'default',
          method: false,
          blockStatement: inner.value.argument.body.body
        }));
      }
    });
}

transformer.forceJavaScriptTransform = true;

export default transformer;