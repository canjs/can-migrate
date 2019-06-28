import makeDebug from 'debug';
import { typeConversions, find } from '../../../utils/typeUtils';

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-property-definitions/property-definitions:${file.path}`);
  const j = api.jscodeshift;
  const root = j(file.source);

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
    });
  })
  .toSource();
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
        // Go through the return statements and update the one which is a Function Expression
        returns.forEach(path => {
          if (path.value.argument.type === type) {
            // Replace with the inner body of the Function Expression
            const index = path.parentPath.value.findIndex(i => i.type === 'ReturnStatement');
            path.parentPath.value.splice(index, 1, ...inner.value.argument.body.body);
          }
        });
      }
    });
}