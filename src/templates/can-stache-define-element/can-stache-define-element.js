// import getConfig from '../../../utils/getConfig';
// import renameImport from '../../../utils/renameImport';
// import replaceRefs from '../../../utils/replaceRefs';
// import makeDebug from 'debug';

// Press ctrl+space for code completion
export default function transformer(file, api) {
  const j = api.jscodeshift;
  let propNames = ['view']
  let props = []

  function createMethodDefinition(j, kind, key, path, isStatic = false) {
    return j.methodDefinition(
      kind,
      key,
      j.functionExpression(null, path.params, path.body),
      isStatic
    );
  }

  return j(file.source)
    .find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: {
          name: "Component"
        },
        property: {
          name: "extend"
        }
      }
    })
    .forEach(p => {
      p.value.arguments[0].properties
      .filter(p => propNames.includes(p.key.name))
        .forEach(path => {
          props.push(path)
        })
      })
    .forEach(path => {
      j(path).replaceWith(
        j.classDeclaration(
          j.identifier("FooBar"),
          j.classBody([]),
          j.identifier("StacheDefineElement")
        )
      );

      props.forEach(prop => {
        path.value.body.body.push(
          createMethodDefinition(
            j,
            "get",
            j.identifier(prop.key.name),
            j.functionExpression(null, [], j.blockStatement([
              j.returnStatement(prop.value)
            ])),
            true
          )
        )
      })
    })
    .toSource();
}
