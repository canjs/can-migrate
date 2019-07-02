import makeDebug from 'debug';
import { find } from '../../../utils/typeUtils';
import fileTransform from '../../../utils/fileUtil';

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-property-definitions/property-functions:${file.path}`);
  const j = api.jscodeshift;
  
  return fileTransform(file, function (source) {
    const root = j(source);
    
    return find(root, 'FunctionExpression', function (props, rootPath) {
      const rootDefine = rootPath.value.value.body.body[0].argument.properties;

      return props.forEach(prop => {
        if (prop.kind !== 'get') {
          // Add the method to the class body
          rootPath.parent.value.body.push(j.methodDefinition(
            'method',
            prop.key,
            prop.value
          ));

          debug(`Removing ${prop.key} from define () {} into class definition`);

          // Remove the method from the static define
          rootDefine.forEach((p, i) => {
            if (p === prop) {
              rootDefine.splice(i, 1);
            }
          });
        }
      });
    })
    .toSource();
  });
}
