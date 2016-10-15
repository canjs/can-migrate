/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/list/';
 *   //OR
 *   import <...> from 'can/list/list';
 *   //OR
 *   import <...> from 'can/list/list.js';
 *   ```
 * After:
 *   ```js 
 *   import canList from  'can-list';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-list-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/list/', 'can/list/list', 'can/list/list.js' ],
    newSourceValue: 'can-list',
    newLocalName: options.name || 'canList'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canList'
    });
  }
  return root.toSource(printOptions);
}
