/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/view/live/';
 *   //OR
 *   import <...> from 'can/view/live/live';
 *   //OR
 *   import <...> from 'can/view/live/live.js';
 *   ```
 * After:
 *   ```js 
 *   import canViewLive from  'can-view-live';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-live-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/view/live/', 'can/view/live/live', 'can/view/live/live.js' ],
    newSourceValue: 'can-view-live',
    newLocalName: options.name || 'canViewLive'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canViewLive'
    });
  }
  return root.toSource(printOptions);
}
