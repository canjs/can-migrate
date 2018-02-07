
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
      if (expression.value.callee.property.name === 'set') {
        if(expression.node.arguments.length === 2) {
          const firstArg = expression.node.arguments[0];
          const secondArg = expression.node.arguments[1];
          if(firstArg.type === 'ObjectExpression' && typeof(secondArg.value) === 'boolean') {
            expression.node.arguments.splice(-1);
          }
        }
        expression.value.callee.property.name = 'update';
      }
    });
  }).toSource();

  root = j(src);

  src = root.find(j.NewExpression, {
    callee: {
      name: 'DefineList'
    }
  }).forEach(expressionStatement => {
    j(expressionStatement).find(j.CallExpression, { callee: { object: { type: 'ThisExpression' } } }).forEach(expression => {
      if (expression.value.callee.property.name === 'set') {
        if(expression.node.arguments.length === 2) {
          const firstArg = expression.node.arguments[0];
          const secondArg = expression.node.arguments[1];
          if(firstArg.type === 'ArrayExpression' && typeof(secondArg.value) === 'boolean') {
            expression.node.arguments.splice(-1);
          }
        }
        expression.value.callee.property.name = 'update';
      }
    });
  }).toSource();

  return src;
}
