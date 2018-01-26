// This is a generated file, see src/templates/replace/replace.ejs
import getConfig from '../../../utils/getConfig';
import dependencyUtils from '../../../utils/dependencyUtils';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-remove-replace:${file.path}`);
  const config = getConfig(options.config);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  let found = false;
  const newName = config.moduleToName['can-util/dom/mutate/mutate'];

  debug(`Finding all instances of 'can.remove'`);
  root.find(j.MemberExpression).filter(expression => {
    let match = true;
    
      match = match && expression.value.object.name === 'can';
    
    return match && expression.value.property.name === 'remove';
  }).forEach(expression => {
    debug(`Replacing all instances of 'can.remove' with '${newName}.removeChild.call'`);
    found = true;
    
    // can.event.addEvent -> canEvent.addEventListener
    j(expression).replaceWith(j.memberExpression(j.identifier(newName), j.identifier('removeChild.call')));
    
  });

  if (found) {
    dependencyUtils.add(root, 'can-util/dom/mutate/mutate', newName, ['can', 'can/', 'can/can', 'can/can.js']);
  }
  return root.toSource(printOptions);
}
