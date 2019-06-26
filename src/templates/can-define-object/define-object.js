import makeDebug from 'debug';
import getConfig from '../../../utils/getConfig';
import defineTransform from '../../../utils/defineTransform';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-define-object:${file.path}`);
  const j = api.jscodeshift;
  const config = getConfig(options.config);
  const extendedClassName = config.moduleToName['can-define-object'];

  return defineTransform({
    j,
    source: file.source,
    extendedClassName,
    objectName: 'DefineMap',
    debug
  });
}
