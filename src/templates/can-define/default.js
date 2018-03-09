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
      // loop through each PropDefinition
      // passed to the first argument of DefineMap.extend
      path.value.arguments[0].properties
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
