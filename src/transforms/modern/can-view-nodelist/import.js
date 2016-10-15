/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/view/node_list/';
 *   //OR
 *   import <...> from 'can/view/node_list/node_list';
 *   //OR
 *   import <...> from 'can/view/node_list/node_list.js';
 *   ```
 * After:
 *   ```js 
 *   import canNodeList from  'can-view-nodelist';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-nodelist-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/view/node_list/', 'can/view/node_list/node_list', 'can/view/node_list/node_list.js' ],
    newSourceValue: 'can-view-nodelist',
    newLocalName: options.name || 'canNodeList'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canNodeList'
    });
  }
  return root.toSource(printOptions);
}
