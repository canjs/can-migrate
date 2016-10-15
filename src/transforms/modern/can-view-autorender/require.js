/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/view/autorender/');
 *   //OR
 *   const <...> = require('can/view/autorender/autorender');
 *   //OR
 *   const <...> = require('can/view/autorender/autorender.js');
 *   ```
 * After:
 *   ```js 
 *   const canAutorender = require('can-view-autorender')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-autorender-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
    oldSourceValues: ['can/view/autorender/', 'can/view/autorender/autorender', 'can/view/autorender/autorender.js' ],
    newSourceValue: 'can-view-autorender',
    newLocalName: options.name || 'canAutorender'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canAutorender'
    });
  }
  return root.toSource(printOptions);
}
