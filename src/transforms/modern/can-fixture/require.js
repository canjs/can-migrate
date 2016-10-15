/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/util/fixture/');
 *   //OR
 *   const <...> = require('can/util/fixture/fixture');
 *   //OR
 *   const <...> = require('can/util/fixture/fixture.js');
 *   ```
 * After:
 *   ```js 
 *   const fixture = require('can-fixture')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-fixture-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
    oldSourceValues: ['can/util/fixture/', 'can/util/fixture/fixture', 'can/util/fixture/fixture.js' ],
    newSourceValue: 'can-fixture',
    newLocalName: options.name || 'fixture'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'fixture'
    });
  }
  return root.toSource(printOptions);
}
