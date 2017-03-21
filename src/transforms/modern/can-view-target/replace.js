// This is a generated file, see src/templates/replace/replace.ejs
import getConfig from '../../../utils/getConfig';
import dependencyUtils from '../../../utils/dependencyUtils';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-view-target-replace:${file.path}`);
  const config = getConfig(options.config);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  let found = false;
  const newName = config.moduleToName['can-view-target'];

  debug(`Finding all instances of 'can.view.target'`);
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
    
    return match && expression.value.property.name === 'target';
  }).forEach(expression => {
    debug(`Replacing all instances of 'can.view.target' with '${newName}'`);
    found = true;
    
    // can.Map -> canMap
    j(expression).replaceWith(j.identifier(newName));
    
  });

  if (found) {
    dependencyUtils.add(root, 'can-view-target', newName, ['can', 'can/', 'can/can', 'can/can.js']);
  }
  return root.toSource(printOptions);
}
