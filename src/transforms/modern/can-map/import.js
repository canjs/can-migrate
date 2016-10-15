/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/map/';
 *   //OR
 *   import <...> from 'can/map/map';
 *   //OR
 *   import <...> from 'can/map/map.js';
 *   ```
 * After:
 *   ```js 
 *   import canMap from  'can-map';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-map-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
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
