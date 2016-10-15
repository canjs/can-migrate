/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/map/');
 *   //OR
 *   const <...> = require('can/map/map');
 *   //OR
 *   const <...> = require('can/map/map.js');
 *   ```
 * After:
 *   ```js 
 *   const canMap = require('can-map')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-map-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
    oldSourceValues: ['can/map/', 'can/map/map', 'can/map/map.js' ],
    newSourceValue: 'can-map',
    newLocalName: options.name || 'canMap'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canMap'
    });
  }
  return root.toSource(printOptions);
}
