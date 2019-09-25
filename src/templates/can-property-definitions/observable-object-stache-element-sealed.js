import makeDebug from 'debug';
import getConfig from '../../../utils/getConfig';
import fileTransform from '../../../utils/fileUtil';
import { createMethod } from '../../../utils/classUtils';

function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-property-definitions/sealed:${file.path}`);
  const j = api.jscodeshift;
  const config = getConfig(options.config);
  const extendedObjectClassName = config.moduleToName['can-observable-object'];
  const extendedStacheClassName = config.moduleToName['can-stache-element'];

  // Transform different file types
  return fileTransform(file, function (source) {
    const root = j(source);
    root
      .find(j.ClassDeclaration, {
      superClass: {
            name: extendedObjectClassName
          }
      })
      .forEach(path => addSeal({j, debug, path}));

    root
      .find(j.ClassDeclaration, {
      superClass: {
            name: extendedStacheClassName
          }
      })
      .forEach(path => addSeal({j, debug, path}));

    return root.toSource();
  });
}

function addSeal({j, debug, path}) {
  const sealed = j(path).find(j.MethodDefinition, {
    key: {
      name: 'seal'
    },
    kind: 'get',
    static: true
  });

  if (!sealed.length) {
    debug(`Setting seal property`);
    path.value.body.body.push(createMethod({
      j,
      name: 'seal',
      blockStatement:  j.blockStatement([j.returnStatement(j.identifier('true'))]),
      isStatic: true,
      method: false
    }));
  }
}

transformer.forceJavaScriptTransform = true;

export default transformer;
