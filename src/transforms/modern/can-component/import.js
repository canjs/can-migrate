/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/component/';
 *   //OR
 *   import <...> from 'can/component/component';
 *   //OR
 *   import <...> from 'can/component/component.js';
 *   ```
 * After:
 *   ```js 
 *   import Component from  'can-component';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-component-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/component/', 'can/component/component', 'can/component/component.js' ],
    newSourceValue: 'can-component',
    newLocalName: options.name || 'Component'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'Component'
    });
  }
  return root.toSource(printOptions);
}
