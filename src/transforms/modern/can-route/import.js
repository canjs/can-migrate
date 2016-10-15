/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/route/';
 *   //OR
 *   import <...> from 'can/route/route';
 *   //OR
 *   import <...> from 'can/route/route.js';
 *   ```
 * After:
 *   ```js 
 *   import canRoute from  'can-route';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-route-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
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
