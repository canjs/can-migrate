/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/view/node_list/');
 *   //OR
 *   const <...> = require('can/view/node_list/node_list');
 *   //OR
 *   const <...> = require('can/view/node_list/node_list.js');
 *   ```
 * After:
 *   ```js 
 *   const canNodeList = require('can-view-nodelist')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-nodelist-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
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
