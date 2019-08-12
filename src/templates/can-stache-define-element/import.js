// This is a generated file, see src/templates/can-extend/can-extend.js
import getConfig from '../../../utils/getConfig';
import renameImport, { updateImport } from '../../../utils/renameImport';
import makeDebug from 'debug';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-stache-define-element:${file.path}`);
  const config = getConfig(options.config);
  const newLocalName = config.moduleToName['can-stache-define-element'];
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};

  return fileTransform(file, function (source) {
    const root = j(source);

    // Update default import
    // import Component from 'can-component'
    renameImport(root, {
      oldSourceValues: ['can-component'],
      newSourceValue: 'can-stache-define-element',
      newLocalName
    });
    // Update the destructured import
    // import { Component } from 'can'
    updateImport(j, root, {
      oldValue: 'Component',
      newValue: newLocalName
    });

    debug(`Replacing import with ${newLocalName}`);

    return root.toSource(printOptions);
  });
}

transformer.forceJavaScriptTransform = true;

export default transformer;