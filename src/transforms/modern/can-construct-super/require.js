/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/construct/super/');
 *   //OR
 *   const <...> = require('can/construct/super/super');
 *   //OR
 *   const <...> = require('can/construct/super/super.js');
 *   ```
 * After:
 *   ```js 
 *   require('can-construct-super')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-construct-super-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
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
