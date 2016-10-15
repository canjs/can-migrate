/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/route/');
 *   //OR
 *   const <...> = require('can/route/route');
 *   //OR
 *   const <...> = require('can/route/route.js');
 *   ```
 * After:
 *   ```js 
 *   const canRoute = require('can-route')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-route-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
    oldSourceValues: ['can/route/', 'can/route/route', 'can/route/route.js' ],
    newSourceValue: 'can-route',
    newLocalName: options.name || 'canRoute'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canRoute'
    });
  }
  return root.toSource(printOptions);
}
