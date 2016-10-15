/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/component/');
 *   //OR
 *   const <...> = require('can/component/component');
 *   //OR
 *   const <...> = require('can/component/component.js');
 *   ```
 * After:
 *   ```js 
 *   const Component = require('can-component')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-component-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
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
