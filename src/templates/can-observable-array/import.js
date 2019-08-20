// This is a generated file, see src/templates/can-extend/can-extend.js
import getConfig from '../../../utils/getConfig';
import renameImport, { updateImport } from '../../../utils/renameImport';
import makeDebug from 'debug';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-observable-array:${file.path}`);
  const config = getConfig(options.config);
  const newLocalName = config.moduleToName['can-observable-array'];
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};

  return fileTransform(file, function (source) {
    const root = j(source);

    // Update default import
    // import DefineList from 'can-define/list/'
    renameImport(root, {
      oldSourceValues: ['can-define/list/list', 'can-define/list/'],
      newSourceValue: 'can-observable-array',
      newLocalName
    });
    // Update the destructured import
    // import { DefineList } from 'can'
    updateImport(j, root, {
      oldValue: 'DefineList',
      newValue: newLocalName
    });

    debug(`Replacing import with ${newLocalName}`);

    return root.toSource(printOptions);
  });
}

transformer.forceJavaScriptTransform = true;

export default transformer;
