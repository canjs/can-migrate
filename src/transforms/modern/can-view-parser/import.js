/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/view/parser/';
 *   //OR
 *   import <...> from 'can/view/parser/parser';
 *   //OR
 *   import <...> from 'can/view/parser/parser.js';
 *   ```
 * After:
 *   ```js 
 *   import canHTMLParser from  'can-view-parser';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-view-parser-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
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
