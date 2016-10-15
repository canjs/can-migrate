/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/compute/';
 *   //OR
 *   import <...> from 'can/compute/compute';
 *   //OR
 *   import <...> from 'can/compute/compute.js';
 *   ```
 * After:
 *   ```js 
 *   import compute from  'can-compute';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-compute-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
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
