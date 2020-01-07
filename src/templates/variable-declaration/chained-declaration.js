import makeDebug from 'debug';

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:variable-declaration/chained-declaration:${file.path}`);
  const j = api.jscodeshift;

  return j(file.source).find(j.VariableDeclaration).forEach(path => {
    path.value.declarations.forEach(() => {
      const kind = path.value.kind;
      const unchainedDeclarations = path.value.declarations.map((declaration, i) => {
      debug('Spliting chained variable declaration');
      const unchainedDeclaration = j.variableDeclaration(kind, [declaration]);
        // handle comments
      if (i === 0) {
        unchainedDeclaration.comments = path.value.comments;
      } else if (declaration.comments) {
        unchainedDeclaration.comments = declaration.comments;
        declaration.comments = null;
      }
        return unchainedDeclaration;
      });
      j(path).replaceWith(unchainedDeclarations);
    });
  }).toSource();
}
