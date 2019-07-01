import makeDebug from 'debug';
import { find } from '../../../utils/typeUtils';

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-property-definitions/property-definition-default:${file.path}`);
  const j = api.jscodeshift;

  const root = j(file.source);

  return find(root, 'ObjectExpression', function (props, rootPath) {
    const rootProps = rootPath.value.value.body.body[0].argument.properties;

    return rootProps.forEach((path, i) => {
      if (path.key.value === '*') {
        rootPath.parent.value.body.push(
          j.methodDefinition(
            'get',
            j.identifier('propertyDefaults'),
            j.functionExpression(
              null,
              [],
              j.blockStatement([j.returnStatement(path.value)])
            ),
            true
          )
        );

        debug(`Removing '*' prop and moving into 'PropertyDefaults' `);

        // Remove the '*' entry
        rootProps.splice(i, 1);
      }
    });
  })
  .toSource();
}
