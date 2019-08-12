export default {
  createClass ({ j, className, body = [], extendedClassName = null } = {}) {
    return j.classDeclaration(
      j.identifier(className),
      j.classBody(body),
      extendedClassName ? j.identifier(extendedClassName) : null
    );
  },
  createMethod ({ j, name, blockStatement = [], isStatic = false, method = true } = {}) {
    return j.methodDefinition(
      method ? 'method' : 'get',
      j.identifier(name),
      j.functionExpression(
        null,
        [],
        blockStatement.type === 'BlockStatement' ? blockStatement : j.blockStatement(blockStatement)
      ),
      isStatic
    );
  }
};
