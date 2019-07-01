import makeDebug from 'debug';
import { addImport } from '../../../utils/renameImport';

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-property-definitions/connected-events:${file.path}`);
  const j = api.jscodeshift;
  const root = j(file.source);

  return root
    .find(j.MethodDefinition, {
      key: {
        name: 'connected'
      },
      kind: 'method'
    })
    .forEach(path => {
      // Find the 'events' variable within the connected method
      j(path).find(j.VariableDeclarator, {
        id: {
          name: 'events'
        }
      }).forEach(node => {
        // Add a new vmControl which is a can-control extend
        path.value.value.body.body.push(j.variableDeclaration('const', [
          j.variableDeclarator(j.identifier('vmControl'), j.callExpression(
            j.memberExpression(
              j.identifier('Control'),
              j.identifier('extend')
            ),
            [j.objectExpression(node.value.init.properties)]
          ))
        ]), j.expressionStatement(j.newExpression(j.identifier('vmControl'), [j.identifier('this')])));

        debug(`Removing 'events' from connected, replacing with Control.extend.`);

        // Remove the events variable
        j(node).remove();

        // Add the import
        addImport(j, root, { importName: 'Control' });
      });
    })
    .toSource();
}
