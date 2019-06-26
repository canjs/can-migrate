import makeDebug from 'debug';
import getConfig from '../../../utils/getConfig';
import defineTransform from '../../../utils/defineTransform';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-define-array:${file.path}`);
  const j = api.jscodeshift;
  const config = getConfig(options.config);
  const extendedClassName = config.moduleToName['can-define-array'];

  return defineTransform({
    j,
    source: file.source,
    extendedClassName,
    objectName: 'DefineList',
    debug
  });
}
