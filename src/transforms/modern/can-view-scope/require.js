/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/view/scope/');
 *   //OR
 *   const <...> = require('can/view/scope/scope');
 *   //OR
 *   const <...> = require('can/view/scope/scope.js');
 *   ```
 * After:
 *   ```js 
 *   const canViewScope = require('can-view-scope')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-scope-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
    oldSourceValues: ['can/view/scope/', 'can/view/scope/scope', 'can/view/scope/scope.js' ],
    newSourceValue: 'can-view-scope',
    newLocalName: options.name || 'canViewScope'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canViewScope'
    });
  }
  return root.toSource(printOptions);
}
