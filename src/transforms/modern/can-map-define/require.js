// This is a generated file, see src/templates/require/require.ejs
import getConfig from '../../../utils/getConfig';
import renameRequire from '../../../utils/renameRequire';
import replaceRefs from '../../../utils/replaceRefs';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:can-map-define-require');

export default function transformer(file, api, options) {
  const config = getConfig(options.config);
  debug(`Running on ${file.path}`);
  const newLocalName = options.replace ? config.moduleToName['can-map-define'] ? config.moduleToName['can-map-define'] : false : false;
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const oldLocalName = renameRequire(root, {
    oldSourceValues: ['can/map/define/', 'can/map/define/define', 'can/map/define/define.js' ],
    newSourceValue: 'can-map-define',
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
