/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/view/autorender/';
 *   //OR
 *   import <...> from 'can/view/autorender/autorender';
 *   //OR
 *   import <...> from 'can/view/autorender/autorender.js';
 *   ```
 * After:
 *   ```js 
 *   import canAutorender from  'can-view-autorender';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-autorender-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/view/autorender/', 'can/view/autorender/autorender', 'can/view/autorender/autorender.js' ],
    newSourceValue: 'can-view-autorender',
    newLocalName: options.name || 'canAutorender'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canAutorender'
    });
  }
  return root.toSource(printOptions);
}
