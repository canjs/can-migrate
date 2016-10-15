/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/event/');
 *   //OR
 *   const <...> = require('can/event/event');
 *   //OR
 *   const <...> = require('can/event/event.js');
 *   ```
 * After:
 *   ```js 
 *   const canEvent = require('can-event')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-event-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
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
