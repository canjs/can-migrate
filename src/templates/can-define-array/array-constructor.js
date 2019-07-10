import makeDebug from 'debug';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-define-array/array-constructor:${file.path}`);
  const j = api.jscodeshift;

  // Transform different file types
  return fileTransform(file, function (source) {
    const root = j(source);
  
    return root
      .find(j.NewExpression, {
        callee: {
          name: 'DefineArray'
        }
      })
      .forEach(path => {
        // Get the current arguments
        const args = path.value.arguments;
        if (args.length) {
          // Replace the current new expression with a new one
          // using the spread operator to spread the args
          j(path).replaceWith(j.newExpression(
            j.identifier('DefineArray'),
            [j.spreadElement(...args)]
          ));

          debug('Replacing DefineArray([]) with DefineArray(...[])');
        }
      })
      .toSource();
  });
}

transformer.forceJavaScriptTransform = true;

export default transformer;