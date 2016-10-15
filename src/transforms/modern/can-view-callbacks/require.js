/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/view/callbacks/');
 *   //OR
 *   const <...> = require('can/view/callbacks/callbacks');
 *   //OR
 *   const <...> = require('can/view/callbacks/callbacks.js');
 *   ```
 * After:
 *   ```js 
 *   const canViewCallbacks = require('can-view-callbacks')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-callbacks-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
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
