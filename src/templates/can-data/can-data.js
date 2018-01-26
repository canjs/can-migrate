// This is a generated file, see src/templates/can-extend/can-extend.js
import getConfig from '../../../utils/getConfig';
import dependencyUtils from '../../../utils/dependencyUtils';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-data:${file.path}`);
  const config = getConfig(options.config);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  root.find(j.MemberExpression, {
    object: {
      name: 'can'
    },
    property: {
      name: 'data'
    }
  })
  .filter(statement => (
    statement.parent.parent.value.type === 'ExpressionStatement'
  ))
  .forEach((statement) => {
    const args = statement.parent.parent.value.expression.arguments;
    const sourceValue = 'can-util/dom/data/data';
    let dataName;
    let funcName;
    if (args.length === 3) {
      funcName = 'set';
    } else if (args.length === 2) {
      funcName = 'get';
    }
    debug(`${args.length} arguments passed to can.data -> ${funcName}`);
    dataName = config.moduleToName[sourceValue];
    debug(`Replacing can.data with ${dataName}.${funcName}.call`);
    dependencyUtils.add(root, sourceValue, dataName, ['can', 'can/can', 'can/can.js']);
    j(statement).replaceWith(j.memberExpression(j.memberExpression(j.identifier(dataName), j.identifier(funcName)), j.identifier('call')));
  });
  return root.toSource(printOptions);
}
