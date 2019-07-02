import makeDebug from 'debug';
import getConfig from '../../../utils/getConfig';
import defineTransform from '../../../utils/defineTransform';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-define-object:${file.path}`);
  const j = api.jscodeshift;
  const config = getConfig(options.config);
  const extendedClassName = config.moduleToName['can-define-object'];

  return fileTransform(file, function (source) {
    return defineTransform({
      j,
      source,
      extendedClassName,
      objectName: 'DefineMap',
      debug
    });
  });
}

transformer.forceJavaScriptTransform = true;

export default transformer;