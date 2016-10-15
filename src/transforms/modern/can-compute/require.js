/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/compute/');
 *   //OR
 *   const <...> = require('can/compute/compute');
 *   //OR
 *   const <...> = require('can/compute/compute.js');
 *   ```
 * After:
 *   ```js 
 *   const compute = require('can-compute')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-compute-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
    oldSourceValues: ['can/compute/', 'can/compute/compute', 'can/compute/compute.js' ],
    newSourceValue: 'can-compute',
    newLocalName: options.name || 'compute'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'compute'
    });
  }
  return root.toSource(printOptions);
}
