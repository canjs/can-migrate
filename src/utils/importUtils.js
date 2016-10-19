import j from 'jscodeshift';
import preserveQuote from './preserveQuote';

export default {
  find(ast, moduleName) {
    return ast.find(j.ImportDeclaration).filter(importStatement => (
      importStatement.value.source.type === 'Literal' && [...moduleName].indexOf(importStatement.value.source.value) !== -1
    ));
  },
  rename(importStatement, newModuleName, newVariableName) {
    let oldLocalName;
    if(newVariableName && importStatement.value.specifiers.length === 1) {
      oldLocalName = importStatement.value.specifiers[0].local.name;
      importStatement.value.specifiers[0].local.name = newVariableName;
    }
    importStatement.value.source.value = preserveQuote(importStatement.value.source.raw[0], newModuleName);
    return oldLocalName;
  },
  create(moduleName, variableName) {
    let declaration;
    let variable;
    let nameIdentifier;

    // if no variable name, return `import 'can'`
    if (!variableName) {
      declaration = j.importDeclaration([], j.literal(moduleName) );
      return declaration;
    }

    // multiple variable names indicates a destructured import
    if (Array.isArray(variableName)) {
      var variableIds = variableName.map(function(v) {
        return j.importSpecifier(j.identifier(v), j.identifier(v));
      });

      declaration = j.importDeclaration(variableIds, j.literal(moduleName));
    } else {
      // else returns `import can from 'can'`
      nameIdentifier = j.identifier(variableName); //import var name
      variable = j.importDefaultSpecifier(nameIdentifier);

      declaration = j.importDeclaration([variable], j.literal(moduleName) );
    }

    return declaration;
  }
};
