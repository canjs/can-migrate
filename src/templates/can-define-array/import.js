// This is a generated file, see src/templates/can-extend/can-extend.js
import getConfig from '../../../utils/getConfig';
import renameImport, { updateImport } from '../../../utils/renameImport';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-define-array:${file.path}`);
  const config = getConfig(options.config);
  const newLocalName = config.moduleToName['can-define-array'];
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);

  // Update default import
  // import DefineList from 'can-define/list/'
  renameImport(root, {
    oldSourceValues: ['can-define/list/list', 'can-define/list/'],
    newSourceValue: 'can-define-array',
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
}
