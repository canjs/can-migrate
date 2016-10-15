/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/event/';
 *   //OR
 *   import <...> from 'can/event/event';
 *   //OR
 *   import <...> from 'can/event/event.js';
 *   ```
 * After:
 *   ```js 
 *   import canEvent from  'can-event';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-event-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/event/', 'can/event/event', 'can/event/event.js' ],
    newSourceValue: 'can-event',
    newLocalName: options.name || 'canEvent'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canEvent'
    });
  }
  return root.toSource(printOptions);
}
