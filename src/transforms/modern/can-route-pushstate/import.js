/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/route/pushstate/';
 *   //OR
 *   import <...> from 'can/route/pushstate/pushstate';
 *   //OR
 *   import <...> from 'can/route/pushstate/pushstate.js';
 *   ```
 * After:
 *   ```js 
 *   import  'can-route-pushstate';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-route-pushstate-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/route/pushstate/', 'can/route/pushstate/pushstate', 'can/route/pushstate/pushstate.js' ],
    newSourceValue: 'can-route-pushstate',
    newLocalName: options.name || 'false'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'false'
    });
  }
  return root.toSource(printOptions);
}
