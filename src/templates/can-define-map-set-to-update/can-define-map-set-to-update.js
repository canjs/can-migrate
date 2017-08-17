// This is a generated file, see src/templates/can-extend/can-extend.js
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-define-map-set-to-update:${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  var setCalls = root.find(j.CallExpression, {
    callee: {
      property: {
          name: 'set'
      }
    }
  });

  setCalls.forEach((statement) => {
    console.log(statement.node.arguments);
    if(statement.node.arguments.length === 2) {
      const firstArg = statement.node.arguments[0];
      const secondArg = statement.node.arguments[1];

      if(firstArg.type === 'ObjectExpression' && typeof(secondArg.rawValue) === 'boolean'){
        debug(`Replacing .set with .update from .set`);
        statement.node.callee.property.name = 'update';
        statement.node.arguments.splice(-1);
      }
    }
  });
  return root.toSource(printOptions);
}
