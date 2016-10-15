/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/util/fixture/';
 *   //OR
 *   import <...> from 'can/util/fixture/fixture';
 *   //OR
 *   import <...> from 'can/util/fixture/fixture.js';
 *   ```
 * After:
 *   ```js 
 *   import fixture from  'can-fixture';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-fixture-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
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
