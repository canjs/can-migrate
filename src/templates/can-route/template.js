import dependencyUtils from '../../../utils/dependencyUtils';

const updateTemplatedRules = (statement) => {
  const parent = statement.parent;
  const args = parent.value.type === 'CallExpression' ?
    // route.register(...)
    parent.parent.value.expression.arguments :
    // route(...)
    parent.value.expression.arguments;
  const rule = args[0];
  rule.value = rule.value.replace(/:([a-zA-Z]*)/g, '\{$1\}');
};

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

    // find all canRoute(...) calls
    root.find(j.CallExpression, {
      callee: {
        name: routeImportVariable
      }
    })
    // modify the templated pieces of the rule (the first argument)
    // :foo -> {foo}
      .forEach(updateTemplatedRules);

    // find all canRoute.register(...) calls
    root.find(j.MemberExpression, {
      object: {
        name: routeImportVariable
      },
      property: {
        name: 'register'
      }
    })
      .forEach(updateTemplatedRules);
  }

  return root.toSource();
}
