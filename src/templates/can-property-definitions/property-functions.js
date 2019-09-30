import makeDebug from 'debug';
import { find } from '../../../utils/typeUtils';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-property-definitions/property-functions:${file.path}`);
  const j = api.jscodeshift;

  return fileTransform(file, function (source) {
    const root = j(source);

    return find(root, 'FunctionExpression', function (props, rootPath) {
      const rootDefine = rootPath.value.value.body.body[0].argument.properties;

      return props.forEach(prop => {
        if (prop.kind !== 'get' && prop.kind !== 'set') {

          // Add the method to the class body
          const method = j.methodDefinition(
            'method',
            prop.key,
            prop.value
          );

          // Keep the comments where they belong
          if (prop.leadingComments && prop.leadingComments.length) {
            method.comments = method.comments ? method.comments : [];
            prop.leadingComments.forEach(function(comment){
              if (comment.type === 'CommentLine') {
                method.comments.push(j.commentLine(comment.value, true, false));
              }
              if (comment.type === 'CommentBlock') {
                method.comments.push(j.commentBlock(comment.value, true, false));
              }
            });
          }
          rootPath.parent.value.body.push(method);

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

transformer.forceJavaScriptTransform = true;

export default transformer;
