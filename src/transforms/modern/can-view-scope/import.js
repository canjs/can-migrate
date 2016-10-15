/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/view/scope/';
 *   //OR
 *   import <...> from 'can/view/scope/scope';
 *   //OR
 *   import <...> from 'can/view/scope/scope.js';
 *   ```
 * After:
 *   ```js 
 *   import canViewScope from  'can-view-scope';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-scope-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
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
