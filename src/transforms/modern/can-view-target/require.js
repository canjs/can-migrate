// This is a generated file, see src/templates/require/require.ejs
import getConfig from '../../../utils/getConfig';
import renameRequire from '../../../utils/renameRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:can-view-target-require');

export default function transformer(file, api, options) {
  const config = getConfig(options.config);
  debug(`Running on ${file.path}`);
  const newLocalName = options.replace ? config.moduleToName['can-view-target'] ? config.moduleToName['can-view-target'] : false : false;
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = renameRequire(root, {
    oldSourceValues: ['can/view/target/', 'can/view/target/target', 'can/view/target/target.js' ],
    newSourceValue: 'can-view-target',
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
