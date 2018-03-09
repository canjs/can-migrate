export default function transformer(file, api) {
  let j = api.jscodeshift;
  let root = j(file.source);

  return root
    .find(j.CallExpression, {
      callee: {
        object: {
          name: 'DefineMap'
        }
      }
    })
    .forEach((path) => {
      let propDefinitionsArg = path.value.arguments.length === 1 ?
        path.value.arguments[0] :
        path.value.arguments[1];

      // loop through each PropDefinition
      // passed to the first argument of DefineMap.extend
      propDefinitionsArg.properties
        .forEach((propDefinition) => {
          if (propDefinition.value.type === 'ObjectExpression') {
            propDefinition.value.properties
              .forEach((behavior) => {
                if (behavior.key.name === 'value') {
                  behavior.key.name = 'default';
                }
              });
          }
        });
    }).toSource();
}
