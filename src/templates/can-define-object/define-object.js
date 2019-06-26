import makeDebug from 'debug';
import getConfig from '../../../utils/getConfig';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-define-object:${file.path}`);
  const j = api.jscodeshift;
  const config = getConfig(options.config);
  const className = config.moduleToName['can-define-object'];

  return j(file.source)
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        object: {
          name: 'DefineMap'
        },
        property: {
          name: 'extend'
        }
      }
    })
    .forEach(path => {
      let varDeclaration;
      let classPath;
      // Replace variable declarations with class def
      if (path.parentPath && path.parentPath.value && path.parentPath.value.type === 'VariableDeclarator') {
        varDeclaration = path.parentPath.value.id.name;
        classPath = path.parentPath.parentPath.parentPath;
      }

      let propDefinitionsArg = path.value.arguments.length === 1 ?
        path.value.arguments[0] :
        path.value.arguments[1];

      debug(`Replacing ${varDeclaration} with ${className} class`);

      j(classPath).replaceWith(
        j.classDeclaration(
          j.identifier(varDeclaration),
          j.classBody([
            j.methodDefinition(
              'method',
              j.identifier('define'),
              j.functionExpression(
                null,
                [],
                j.blockStatement([
                  j.returnStatement(propDefinitionsArg)
                ])
              ),
              true
            )
          ]),
          j.identifier(className)
        )
      );

    })
    .toSource();
}
