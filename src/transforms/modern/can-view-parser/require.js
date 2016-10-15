/**
 * Replaces old require statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   const <...> = require('can/view/parser/');
 *   //OR
 *   const <...> = require('can/view/parser/parser');
 *   //OR
 *   const <...> = require('can/view/parser/parser.js');
 *   ```
 * After:
 *   ```js 
 *   const canHTMLParser = require('can-view-parser')
 */
import replaceRequire from '../../../utils/replaceRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-parser-require');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceRequire(j, root, {
    oldSourceValues: ['can/view/parser/', 'can/view/parser/parser', 'can/view/parser/parser.js' ],
    newSourceValue: 'can-view-parser',
    newLocalName: options.name || 'canHTMLParser'
  });
  if(oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName: options.name || 'canHTMLParser'
    });
  }
  return root.toSource(printOptions);
}
