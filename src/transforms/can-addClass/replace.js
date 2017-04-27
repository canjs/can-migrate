// This is a generated file, see src/templates/replace/replace.ejs
import getConfig from '../../utils/getConfig';
import dependencyUtils from '../../utils/dependencyUtils';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-addClass-replace:${file.path}`);
  const config = getConfig(options.config);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  let found = false;
  const newName = config.moduleToName['can-util/dom/class-name/class-name'];

  debug(`Finding all instances of 'can.addClass'`);
  root.find(j.MemberExpression).filter(expression => {
    let match = true;
    
      match = match && expression.value.object.name === 'can';
    
    return match && expression.value.property.name === 'addClass';
  }).forEach(expression => {
    debug(`Replacing all instances of 'can.addClass' with '${newName}.addClass.call'`);
    found = true;
    
    // can.event.addEvent -> canEvent.addEventListener
    j(expression).replaceWith(j.memberExpression(j.identifier(newName), j.identifier('addClass.call')));
    
  });

  if (found) {
    dependencyUtils.add(root, 'can-util/dom/class-name/class-name', newName, ['can', 'can/', 'can/can', 'can/can.js']);
  }
  return root.toSource(printOptions);
}
