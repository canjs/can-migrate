// This is a generated file, see src/templates/import/import.ejs
import getConfig from '../../../utils/getConfig';
import renameImport from '../../../utils/renameImport';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:can-fixture-import');

export default function transformer(file, api, options) {
  const config = getConfig(options.config);
  debug(`Running on ${file.path}`);
  const newLocalName = options.replace ? config.moduleToName['can-fixture'] ? config.moduleToName['can-fixture'] : false : false;
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = renameImport(root, {
    oldSourceValues: ['can/util/fixture/', 'can/util/fixture/fixture', 'can/util/fixture/fixture.js' ],
    newSourceValue: 'can-fixture',
    newLocalName
  });
  if(options.replace && oldLocalName) {
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName
    });
  }
  return root.toSource(printOptions);
}
