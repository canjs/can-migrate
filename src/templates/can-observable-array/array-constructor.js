import makeDebug from 'debug';
import fileTransform from '../../../utils/fileUtil';

const replacementName = 'ObservableArray';

function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-observable-array/array-constructor:${file.path}`);
  const j = api.jscodeshift;

  // Transform different file types
  return fileTransform(file, function (source) {
    const root = j(source);

    // Transform any `new ObservableArray`
    replaceWithSpread(j, root, replacementName, debug);
    // Replace any `new DefineList` with `new ObservableArray`
    replaceWithSpread(j, root, 'DefineList', debug);

    return root.toSource();
  });
}

function replaceWithSpread(j, root, name, debug) {
  root
    .find(j.NewExpression, {
      callee: {
        name
      }
    })
    .forEach(path => {
      // Get the current arguments
      const args = path.value.arguments;
      if (args.length) {
        // Replace the current new expression with a new one
        // using the spread operator to spread the args
        j(path).replaceWith(j.newExpression(
          j.identifier(replacementName),
          [j.spreadElement(...args)]
        ));

        debug(`Replacing ${replacementName}([]) with ${replacementName}(...[])`);
      } else if (path.value.callee.name !== replacementName) {
        // Update the name
        path.value.callee.name = replacementName;
      }
    });
}

transformer.forceJavaScriptTransform = true;

export default transformer;
