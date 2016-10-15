/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/construct/super/';
 *   //OR
 *   import <...> from 'can/construct/super/super';
 *   //OR
 *   import <...> from 'can/construct/super/super.js';
 *   ```
 * After:
 *   ```js 
 *   import  'can-construct-super';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-construct-super-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/construct/super/', 'can/construct/super/super', 'can/construct/super/super.js' ],
    newSourceValue: 'can-construct-super',
    newLocalName: options.name || 'false'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'false'
    });
  }
  return root.toSource(printOptions);
}
