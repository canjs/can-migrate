import makeDebug from 'debug';
import getConfig from '../../../utils/getConfig';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-rest-model:${file.path}`);
  const j = api.jscodeshift;
  const config = getConfig(options.config);
  const realtimeRestModelName = config.moduleToName['can-realtime-rest-model'];
  const restModelName = config.moduleToName['can-rest-model'];
  const replacements = [{ oldKey: 'Map', newKey: 'ObjectType' }, { oldKey: 'List', newKey: 'ArrayType' }];

  return fileTransform(file, function (source) {
    const root = j(source);

    root
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: restModelName,
      }
    }).forEach(path => checkAndUpdateOptionsKey(path, debug, restModelName, replacements));

    root
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: realtimeRestModelName,
      }
    }).forEach(path => checkAndUpdateOptionsKey(path, debug, realtimeRestModelName, replacements));

    return root.toSource();
  });
}

function checkAndUpdateOptionsKey(path, debug, packageName, replacements) {
  let propDefinitionsArg = path.value.arguments[0];

  propDefinitionsArg.properties.forEach( prop => {
    if (prop.type === 'Property') {
      replacements.forEach(replacement => {
        if (prop.key.name === replacement.oldKey) {
          debug(`Replacing '${packageName}.${replacement.oldKey}' with '${packageName}.${replacement.newKey}'`);
          prop.key.name = replacement.newKey;
        }
      });
    }
  });
}

transformer.forceJavaScriptTransform = true;

export default transformer;
