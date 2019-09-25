import makeDebug from 'debug';
import getConfig from '../../../utils/getConfig';
import fileTransform from '../../../utils/fileUtil';

/**
 * Transform
 * ```
 * const M = realtimeRestModel("/api/todos/{id}").Map;
 * const L = realtimeRestModel("/api/todos/{id}").List;
 * ```
 * to
 * ```
 * const M = realtimeRestModel("/api/todos/{id}").ObjectType;
 * const L = realtimeRestModel("/api/todos/{id}").ArrayObject;
 * ```
 * for restModel and realtimeRestModel
 */
function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-rest-model/can-rest-model-map-short:${file.path}`);
  const config = getConfig(options.config);
  const j = api.jscodeshift;
  const restModelName = config.moduleToName['can-rest-model'];
  const realtimeRestModelName = config.moduleToName['can-realtime-rest-model'];
  const replacements = [{ oldKey: 'Map', newKey: 'ObjectType' }, { oldKey: 'List', newKey: 'ArrayType' }];

  return fileTransform(file, function (source) {
    const root = j(source);

    // restModel
    root.find(j.CallExpression, {
      callee: {
        name: restModelName
      }
    }).forEach((path) => checkAndUpdate(path, debug, restModelName, replacements));

    // realtimeRestModel
    root.find(j.CallExpression, {
      callee: {
        name: realtimeRestModelName
      }
    }).forEach((path) => checkAndUpdate(path, debug, realtimeRestModelName, replacements));

    return root.toSource();
  });
}

function checkAndUpdate(path, debug, packageName, replacements) {
  replacements.forEach(replacement => {
    if (path.parentPath.value.property && path.parentPath.value.property.name === replacement.oldKey) {
      debug(`Replacing '${packageName}.${replacement.oldKey}' with '${packageName}.${replacement.newKey}'`);
      path.parentPath.value.property.name = replacement.newKey;
    }
  });
}

transformer.forceJavaScriptTransform = true;

export default transformer;
