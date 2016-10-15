/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/model/';
 *   //OR
 *   import <...> from 'can/model/model';
 *   //OR
 *   import <...> from 'can/model/model.js';
 *   ```
 * After:
 *   ```js 
 *   import Model from  'can-model';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-model-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/model/', 'can/model/model', 'can/model/model.js' ],
    newSourceValue: 'can-model',
    newLocalName: options.name || 'Model'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'Model'
    });
  }
  return root.toSource(printOptions);
}
