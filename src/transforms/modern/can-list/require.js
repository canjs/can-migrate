/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/list/');
 *   //OR
 *   const <...> = require('can/list/list');
 *   //OR
 *   const <...> = require('can/list/list.js');
 *   ```
 * After:
 *   ```js 
 *   const canList = require('can-list')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-list-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
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
