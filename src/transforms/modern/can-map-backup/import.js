/**
 * Replaces old import statements with new ones and renames all references to the old variables.
 * 
 * Before:
 *   ```js 
 *   import <...> from 'can/map/backup/';
 *   //OR
 *   import <...> from 'can/map/backup/backup';
 *   //OR
 *   import <...> from 'can/map/backup/backup.js';
 *   ```
 * After:
 *   ```js 
 *   import  'can-map-backup';
 */
import replaceImport from '../../../utils/replaceImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:modern-can-map-backup-import');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = replaceImport(j, root, {
    oldSourceValues: ['can/map/backup/', 'can/map/backup/backup', 'can/map/backup/backup.js' ],
    newSourceValue: 'can-map-backup',
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
