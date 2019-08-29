import makeDebug from 'debug';
import fileTransform from '../../../utils/fileUtil';

const replacementName = 'ObservableArray';

function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-observable-array/array-constructor:${file.path}`);
  const j = api.jscodeshift;

  // Transform different file types
  return fileTransform(file, function (source) {
    const root = j(source);

    // Replace any `new DefineList` with `new ObservableArray`
    replaceWithObservable(j, root, 'DefineList', debug);

    return root.toSource();
  });
}

function replaceWithObservable(j, root, name, debug) {
  root
    .find(j.NewExpression, {
      callee: {
        name
      }
    })
    .forEach(path => {
      if (path.value.callee.name !== replacementName) {
        debug(`Replacing ${path.value.callee.name} with ${replacementName}`);
        // Update the name
        path.value.callee.name = replacementName;
      }
    });
}

transformer.forceJavaScriptTransform = true;

export default transformer;
