import makeDebug from 'debug';
import { find } from '../../../utils/typeUtils';
import { createMethod } from '../../../utils/classUtils';
import replaceRefs from '../../../utils/replaceRefs';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-property-definitions/connectedcallback:${file.path}`);
  const j = api.jscodeshift;

  // Transform different file types
  return fileTransform(file, function (source) {
    const root = j(source);
  
    return find(root, 'FunctionExpression', function (props, rootPath) {
      const rootProps = rootPath.value.value.body.body[0].argument.properties;
      const connectedCallback = props.filter(p => p.key.name === 'connectedCallback');

      // Check we have a connectedCallback method before moving onwards
      if (connectedCallback.length > 0) {
        // Look for an existing connected method
        const connectedMethodExists = j(rootPath.parentPath).find(j.MethodDefinition, {
          key: {
            name: 'connected'
          },
          kind: 'method'
        });
        
        // Create one if one does not already exist
        if (connectedMethodExists.length === 0) {
          rootPath.parentPath.value.push(createMethod({
            j,
            name: 'connected'
          }));
        }
        // Find the connected method so we can push into the body of it
        const connectedMethod = rootPath.parentPath.value.find(m => m.kind === 'method' && m.key.name === 'connected');
        // Add the body of the connectedCallback into the connected method
        connectedCallback.forEach(path => {
          // If the connectedCallback has an argument
          // update the refs it uses to be 'this'
          if (path.value.params.length === 1) {
            const name = path.value.params[0].name;

            debug(`Updating connectedCallback argument: ${name}`);

            replaceRefs(j, j(path), {
              oldLocalName: name,
              newLocalName: 'this'
            });
          }

          debug(`Adding connectedCallback to connected`);

          connectedMethod.value.body.body.push(...path.value.body.body);
          // Remove the connectedCallback
          const index = rootProps.findIndex(methods => methods === path);
          rootProps.splice(index, 1);
        });
      }
    }).toSource();
  });
}

transformer.forceJavaScriptTransform = true;

export default transformer;