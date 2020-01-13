import makeDebug from 'debug';
import fileTransform from '../../../utils/fileUtil';

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:variable-declaration/chained-declaration:${file.path}`);
  const j = api.jscodeshift;

  return fileTransform(file, function (source) {
    if (
      hasDeclarations({j, source,  objectName: 'DefineMap'}) ||
      hasDeclarations({j, source,  objectName: 'DefineList'}) ||
      hasDeclarations({j, source,  objectName: 'Component'})
     ) {

      // Filter declarations except the declaration inside "for" statement
      const chainedDeclarations = j(source)
        .find(j.VariableDeclaration)
        .filter(variableDeclaration => (
          variableDeclaration.value.declarations.length > 1
        ))
        .filter(variableDeclaration => (
          variableDeclaration.parent.value.type !== 'ForStatement'
        ));

      return chainedDeclarations.forEach(chainedDeclaration => {
        const kind = chainedDeclaration.value.kind;
        debug(`Splitting chained ${kind} declaration`);
        j(chainedDeclaration)
          .replaceWith(chainedDeclaration.value.declarations.map((declaration, i) => {
            const unchainedDeclaration =
              j.variableDeclaration(kind, [declaration]);

            if (i === 0) {
              unchainedDeclaration.comments = chainedDeclaration.value.comments;
            } else if (declaration.comments) {
              unchainedDeclaration.comments = declaration.comments;
              declaration.comments = null;
            }

            return unchainedDeclaration;
          }));
      }).toSource();
    }
    return source.toSource();
  });
}

function hasDeclarations({j, source,  objectName = 'DefineMap'} = {}) {
  const declarations = j(source).find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: {
        name: objectName
      },
      property: {
        name: 'extend'
      }
    }
  });
  return declarations.length > 0;
}
