/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/control/');
 *   //OR
 *   const <...> = require('can/control/control');
 *   //OR
 *   const <...> = require('can/control/control.js');
 *   ```
 * After:
 *   ```js 
 *   const Control = require('can-control')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-control-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
    oldSourceValues: ['can/control/', 'can/control/control', 'can/control/control.js' ],
    newSourceValue: 'can-control',
    newLocalName: options.name || 'Control'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'Control'
    });
  }
  return root.toSource(printOptions);
}
