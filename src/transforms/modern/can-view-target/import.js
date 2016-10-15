/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/view/target/';
 *   //OR
 *   import <...> from 'can/view/target/target';
 *   //OR
 *   import <...> from 'can/view/target/target.js';
 *   ```
 * After:
 *   ```js 
 *   import canViewTarget from  'can-view-target';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-target-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
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
