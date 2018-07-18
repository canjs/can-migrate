import dependencyUtils from '../../../utils/dependencyUtils';

export default function transformer(file, api) {
  const path = file.path;
  const type = path.slice(path.lastIndexOf('.') + 1);
  const j = api.jscodeshift;
  const root = j(file.source);

  if (type === 'js') {
    let routeImportVariable = '';

    // replace `import 'can-route-pushstate';`
    // with `import RoutePushstate from 'can-route-pushstate';`
    dependencyUtils
      .find(root, ['can-route-pushstate/can-route-pushstate', 'can-route-pushstate'])
      .replaceWith(function() {
        return dependencyUtils.create(root, 'can-route-pushstate', 'RoutePushstate');
      });

    // find the name for the can-route import, ie 'canRoute' in:
    // 'import canRoute from 'can-route';
    dependencyUtils
      .find(root, ['can-route/can-route', 'can-route'])
      .find(j.ImportDefaultSpecifier)
      .forEach((foo) => {
        routeImportVariable = foo.value.local.name;
      });

    // find all the places that route.start is called
    root.find(j.MemberExpression, {
      object: {
        name: routeImportVariable
      },
      property: {
        name: 'register'
      }
    })
    // find the first time route.register is called
    .at(0)
    .closest(j.ExpressionStatement)
    // set route.urlData before
    .insertBefore([ `${routeImportVariable}.urlData = new RoutePushstate();` ]);
  }

  return root.toSource();
}
