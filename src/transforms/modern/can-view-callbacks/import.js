/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/view/callbacks/';
 *   //OR
 *   import <...> from 'can/view/callbacks/callbacks';
 *   //OR
 *   import <...> from 'can/view/callbacks/callbacks.js';
 *   ```
 * After:
 *   ```js 
 *   import canViewCallbacks from  'can-view-callbacks';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-callbacks-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/view/callbacks/', 'can/view/callbacks/callbacks', 'can/view/callbacks/callbacks.js' ],
    newSourceValue: 'can-view-callbacks',
    newLocalName: options.name || 'canViewCallbacks'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canViewCallbacks'
    });
  }
  return root.toSource(printOptions);
}
