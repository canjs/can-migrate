import j from 'jscodeshift';
import preserveQuote from './preserveQuote';

export default {
  find(ast, moduleName) {
    return ast.find(j.CallExpression, {
      callee: {
        name: 'require'
      }
    }).filter(requireStatement => (
      requireStatement.value.arguments[0].type === 'Literal' && [...moduleName].indexOf(requireStatement.value.arguments[0].value) !== -1
    ));
  },
  getDeclarator(requireStatement) {
    let statement = requireStatement;
    let found = false;
    while(!found && statement.parent) {
      if(statement.node.type === 'VariableDeclarator') {
        found = true;
      }
      statement = statement.parent;
    }
    return statement;
  },
  rename(requireStatement, newModuleName, newVariableName) {
    let oldLocalName;
    if(newVariableName && requireStatement.parent.parent.value.declarations && requireStatement.parent.parent.value.declarations.length === 1) {
      oldLocalName = requireStatement.parent.parent.value.declarations[0].id.name;
      requireStatement.parent.parent.value.declarations[0].id.name = newVariableName;
    }
    requireStatement.node.arguments[0].value = preserveQuote(requireStatement.node.arguments[0].raw, newModuleName);
    return oldLocalName;
  },
  create(moduleName, variableName, kind = 'var') {
    let declaration;
    let variable;
    let nameIdentifier;
    const requireCall = j.callExpression(j.identifier('require'), [j.literal(moduleName)]);

    if (!variableName) {
      declaration = j.expressionStatement(requireCall);
      return declaration;
    }
    // multiple variable names indicates a destructured require
    if (Array.isArray(variableName)) {
      var variableIds = variableName.map(function(v) {
        const property = j.property('init', j.identifier(v), j.identifier(v));
        property.shorthand = true;
        return property;
      });
      nameIdentifier = j.objectPattern(variableIds);
      variable = j.variableDeclarator(nameIdentifier, requireCall);
    } else {
      // else returns `import can from 'can'`
      nameIdentifier = j.identifier(variableName); //import var name
      variable = j.variableDeclarator(nameIdentifier, requireCall);
    }
    declaration = j.variableDeclaration(kind, [variable]);

    return declaration;
  }
};
