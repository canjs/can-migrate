/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/view/target/');
 *   //OR
 *   const <...> = require('can/view/target/target');
 *   //OR
 *   const <...> = require('can/view/target/target.js');
 *   ```
 * After:
 *   ```js 
 *   const canViewTarget = require('can-view-target')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-target-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
    oldSourceValues: ['can/view/target/', 'can/view/target/target', 'can/view/target/target.js' ],
    newSourceValue: 'can-view-target',
    newLocalName: options.name || 'canViewTarget'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canViewTarget'
    });
  }
  return root.toSource(printOptions);
}
