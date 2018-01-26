// This is a generated file, see src/templates/require/require.ejs
import getConfig from '../../utils/getConfig';
import renameRequire from '../../utils/renameRequire';
import replaceRefs from '../../utils/replaceRefs';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-view-href-require:${file.path}`);
  const config = getConfig(options.config);
  const newLocalName = config.moduleToName['can-view-href'];
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = renameRequire(root, {
    oldSourceValues: ['can/view/href/', 'can/view/href/href', 'can/view/href/href.js' ],
    newSourceValue: 'can-view-href',
    newLocalName
  });
  if(oldLocalName) {
    debug(`Replacing all occurences of ${oldLocalName} with ${newLocalName}`);
    replaceRefs(j, root, {
      oldLocalName,
      newLocalName
    });
  }
  return root.toSource(printOptions);
}
