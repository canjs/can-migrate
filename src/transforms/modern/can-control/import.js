/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/control/';
 *   //OR
 *   import <...> from 'can/control/control';
 *   //OR
 *   import <...> from 'can/control/control.js';
 *   ```
 * After:
 *   ```js 
 *   import Control from  'can-control';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-control-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/control/', 'can/control/control', 'can/control/control.js' ],
    newSourceValue: 'can-control',
    newLocalName: options.name || 'Control'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'Control'
    });
  }
  return root.toSource(printOptions);
}
