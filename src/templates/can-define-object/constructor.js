import makeDebug from 'debug';
import fileTransform from '../../../utils/fileUtil';

const replacementName = 'ObservableObject';

function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-define-object/constructor:${file.path}`);
  const j = api.jscodeshift;

  // Transform different file types
  return fileTransform(file, function (source) {
    const root = j(source);

    // Transform any `new DefineMap` into `new ObservableObject`
    root
    .find(j.NewExpression, {
      callee: {
        name: 'DefineMap'
      }
    })
    .forEach(path => {
      debug(`Replacing DefineMap with ${replacementName}`);
      // Update the name
      path.value.callee.name = replacementName;
    });
    
    return root.toSource();
  });
}

transformer.forceJavaScriptTransform = true;

export default transformer;