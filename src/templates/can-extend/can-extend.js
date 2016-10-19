// This is a generated file, see src/templates/can-extend/can-extend.js
import getConfig from '../../../utils/getConfig';
import dependencyUtils from '../../../utils/dependencyUtils';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:can-extend');

export default function transformer(file, api, options) {
  const config = getConfig(options.config);
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  root.find(j.MemberExpression, {
    object: {
      name: 'can'
    },
    property: {
      name: 'extend'
    }
  })
  .filter(statement => (
    statement.parent.parent.value.type === 'ExpressionStatement'
  ))
  .forEach((statement) => {
    const args = statement.parent.parent.value.expression.arguments;
    let funcName;
    let sourceValue;
    if(args[0].type === 'Literal' && typeof args[0].value === 'boolean') {
      debug(`First argument to can.extend is ${args[0].value}`);
      sourceValue = args[0].value ? 'can-util/js/deep-assign/deep-assign' : 'can-util/js/assign/assign';
      args.splice(0,1);
    } else {
      sourceValue = 'can-util/js/assign/assign';
    }
    funcName = config.moduleToName[sourceValue];
    debug(`Replacing can.extend with ${funcName} from ${sourceValue}`);
    dependencyUtils.add(root, sourceValue, funcName, ['can', 'can/can', 'can/can.js']);
    j(statement).replaceWith(j.identifier(funcName));
  });
  return root.toSource(printOptions);
}
