
export default function transformer(file, api) {
  let j = api.jscodeshift;
  let root = j(file.source);

  return root.find(j.CallExpression, {
    callee: {
      object: {
        name: 'DefineMap'
      }
    }
  }).forEach(expressionStatement => {
    j(expressionStatement).find(j.CallExpression, { callee: { object: { type: 'ThisExpression' } } }).forEach(identifier => {
      
      identifier.node.name = 'default';
    });
  }).toSource();
}
