/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/map/define/';
 *   //OR
 *   import <...> from 'can/map/define/define';
 *   //OR
 *   import <...> from 'can/map/define/define.js';
 *   ```
 * After:
 *   ```js 
 *   import  'can-map-define';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-map-define-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/map/define/', 'can/map/define/define', 'can/map/define/define.js' ],
    newSourceValue: 'can-map-define',
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
