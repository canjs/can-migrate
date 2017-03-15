// This is a generated file, see src/templates/replace/replace.ejs
import getConfig from '../../../utils/getConfig';
import dependencyUtils from '../../../utils/dependencyUtils';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:can-view-tag-replace');

export default function transformer(file, api, options) {
  const config = getConfig(options.config);
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  let found = false;
  const newName = config.moduleToName['can-view-callbacks'];

  debug(`Finding all instances of 'can.view.tag'`);
  root.find(j.MemberExpression).filter(expression => {
    let match = true;
    
    if(expression.value.object.property) {
      const parts = 'can.view'.split('.');
      const objectName = parts[0];
      const objectProp = parts[1];
      // Figure out if the nested object matches
      match = match && 
        expression.value.object.object.name === objectName &&
        expression.value.object.property.name === objectProp;
    } else {
      return false;
    }
     
    return match && expression.value.property.name === 'tag';
  }).forEach(expression => {
    debug(`Replacing all instances of 'can.view.tag' with '${newName}.tag'`);
    found = true;
    
    // can.event.addEvent -> canEvent.addEventListener
    j(expression).replaceWith(j.memberExpression(j.identifier(newName), j.identifier('tag')));
    
  });

  if (found) {
    dependencyUtils.add(root, 'can-view-callbacks', newName, ['can', 'can/can', 'can/can.js']);
  }
  return root.toSource(printOptions);
}
