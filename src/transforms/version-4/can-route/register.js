import dependencyUtils from '../../../utils/dependencyUtils';

export default function transformer(file, api) {
  const path = file.path;
  const type = path.slice(path.lastIndexOf('.') + 1);
  const j = api.jscodeshift;
  const root = j(file.source);

  if (type === 'js') {
    let routeImportVariable = '';

    // find the name for the can-route import, ie 'canRoute' in:
    // 'import canRoute from 'can-route';
    dependencyUtils
      .find(root, ['can-route/can-route', 'can-route'])
      .find(j.ImportDefaultSpecifier)
      .forEach((foo) => {
        routeImportVariable = foo.value.local.name;
      });

    // find all the places that function is called
    root
      .find(j.CallExpression, {
        callee: {
          name: routeImportVariable
        }
    })
    // replace it with .register
    .replaceWith(function (path) {
      return j.callExpression(
        j.memberExpression(
          j.identifier(routeImportVariable),
          j.identifier('register')
        ),
        path.node.arguments
      );
    });
  }

  return root.toSource();
}
