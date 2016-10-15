/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/view/stache/';
 *   //OR
 *   import <...> from 'can/view/stache/stache';
 *   //OR
 *   import <...> from 'can/view/stache/stache.js';
 *   ```
 * After:
 *   ```js 
 *   import stache from  'can-stache';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-stache-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/view/stache/', 'can/view/stache/stache', 'can/view/stache/stache.js' ],
    newSourceValue: 'can-stache',
    newLocalName: options.name || 'stache'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'stache'
    });
  }
  return root.toSource(printOptions);
}
