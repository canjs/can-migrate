// This is a generated file, see src/templates/can-extend/can-extend.js
import getConfig from '../../../utils/getConfig';
import renameImport, { updateImport } from '../../../utils/renameImport';
import makeDebug from 'debug';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-observable-object:${file.path}`);
  const config = getConfig(options.config);
  const newLocalName = config.moduleToName['can-observable-object'];
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};

  return fileTransform(file, function (source) {
    const root = j(source);

    // Update default import
    // import DefineMap from 'can-define/map/'
    renameImport(root, {
      oldSourceValues: ['can-define/map/map', 'can-define/map/'],
      newSourceValue: 'can-observable-object',
      newLocalName
    });
    // Update the destructured import
    // import { DefineMap } from 'can'
    updateImport(j, root, {
      oldValue: 'DefineMap',
      newValue: newLocalName
    });

    debug(`Replacing import with ${newLocalName}`);

    return root.toSource(printOptions);
  });
}

transformer.forceJavaScriptTransform = true;

export default transformer;
