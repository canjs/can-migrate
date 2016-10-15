/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/model/');
 *   //OR
 *   const <...> = require('can/model/model');
 *   //OR
 *   const <...> = require('can/model/model.js');
 *   ```
 * After:
 *   ```js 
 *   const Model = require('can-model')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-model-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
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
