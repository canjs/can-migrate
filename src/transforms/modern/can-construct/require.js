/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/construct/');
 *   //OR
 *   const <...> = require('can/construct/construct');
 *   //OR
 *   const <...> = require('can/construct/construct.js');
 *   ```
 * After:
 *   ```js 
 *   const Construct = require('can-construct')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-construct-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
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
