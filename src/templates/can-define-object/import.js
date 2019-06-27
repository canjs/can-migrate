// This is a generated file, see src/templates/can-extend/can-extend.js
import getConfig from '../../../utils/getConfig';
import renameImport, { updateImport } from '../../../utils/renameImport';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-define-object:${file.path}`);
  const config = getConfig(options.config);
  const newLocalName = config.moduleToName['can-define-object'];
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);

  // Update default import
  // import DefineMap from 'can-define/map/'
  renameImport(root, {
    oldSourceValues: ['can-define/map/map', 'can-define/map/'],
    newSourceValue: 'can-define-object',
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
}
