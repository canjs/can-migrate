
export default function transformer(file, api) {
  let j = api.jscodeshift;
  let root = j(file.source);

  let src = root.find(j.CallExpression, {
    callee: {
      object: {
        name: 'DefineMap'
      }
    }
  }).forEach(expressionStatement => {
    j(expressionStatement).find(j.CallExpression, { callee: { object: { type: 'ThisExpression' } } }).forEach(expression => {
      expression.value.callee.property.name = 'forEach';
    });
  }).toSource();

  root = j(src);

  src = root.find(j.NewExpression, {
    callee: {
      name: 'DefineList'
    }
  }).forEach(expressionStatement => {
    j(expressionStatement).find(j.CallExpression, { callee: { object: { type: 'ThisExpression' } } }).forEach(expression => {
      expression.value.callee.property.name = 'forEach';
    });
  }).toSource();

  return src;
}
