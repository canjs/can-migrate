/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/view/stache/');
 *   //OR
 *   const <...> = require('can/view/stache/stache');
 *   //OR
 *   const <...> = require('can/view/stache/stache.js');
 *   ```
 * After:
 *   ```js 
 *   const stache = require('can-stache')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-stache-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
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
