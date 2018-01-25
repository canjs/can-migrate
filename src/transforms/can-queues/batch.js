import getConfig from '../../utils/getConfig';
import renameImport from '../../utils/renameImport';
import renameRequire from '../../utils/renameRequire';
import replaceRefs from '../../utils/replaceRefs';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  let debug = makeDebug(`can-migrate:can-view-scope-import:${file.path}`);
  let config = getConfig(options.config);
  let newLocalName = config.moduleToName['can-queues'];
  let printOptions = options.printOptions || {};
  let j = api.jscodeshift;
  let root = j(file.source);

  let doRename = function(renameFn) {
    let oldLocalName = renameFn(root, {
      oldSourceValues: ['can-event/batch/batch'],
      newSourceValue: 'can-queues',
      newLocalName
    });
    if(oldLocalName) {
      debug(`Replacing all occurences of ${oldLocalName} with ${newLocalName}`);
      replaceRefs(j, root, {
        oldLocalName,
        newLocalName: newLocalName + '.batch'
      });
    }
  };

  // ESM
  doRename(renameImport);

  // CJS
  doRename(renameRequire);


  return root.toSource(printOptions);
}
