/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/construct/';
 *   //OR
 *   import <...> from 'can/construct/construct';
 *   //OR
 *   import <...> from 'can/construct/construct.js';
 *   ```
 * After:
 *   ```js 
 *   import Construct from  'can-construct';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-construct-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/construct/', 'can/construct/construct', 'can/construct/construct.js' ],
    newSourceValue: 'can-construct',
    newLocalName: options.name || 'Construct'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'Construct'
    });
  }
  return root.toSource(printOptions);
}
