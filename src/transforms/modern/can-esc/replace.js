// This is a generated file, see src/templates/replace/replace.ejs
import getConfig from '../../../utils/getConfig';
import dependencyUtils from '../../../utils/dependencyUtils';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:can-esc-replace');

export default function transformer(file, api, options) {
  const config = getConfig(options.config);
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  let found = false;
  const newName = config.moduleToName['can-util/js/string/string'];

  debug(`Finding all instances of 'can.esc'`);
  root.find(j.MemberExpression).filter(expression => {
    let match = true;
    
      match = match && expression.value.object.name === 'can';
     
    return match && expression.value.property.name === 'esc';
  }).forEach(expression => {
    debug(`Replacing all instances of 'can.esc' with '${newName}.esc'`);
    found = true;
    
    // can.event.addEvent -> canEvent.addEventListener
    j(expression).replaceWith(j.memberExpression(j.identifier(newName), j.identifier('esc')));
    
  });

  if (found) {
    dependencyUtils.add(root, 'can-util/js/string/string', newName, ['can', 'can/can', 'can/can.js']);
  }
  return root.toSource(printOptions);
}
