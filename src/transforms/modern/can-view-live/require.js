/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/view/live/');
 *   //OR
 *   const <...> = require('can/view/live/live');
 *   //OR
 *   const <...> = require('can/view/live/live.js');
 *   ```
 * After:
 *   ```js 
 *   const canViewLive = require('can-view-live')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-live-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
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
