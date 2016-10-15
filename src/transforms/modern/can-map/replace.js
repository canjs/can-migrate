/**
 * Replaces instances where can.* is used in code. Also adds appropriate import/require.
 * 
 * Before:
 *   ```js 
 *     can.Map;
 *   ```
 * After:
 *   ```js 
 *   const canMap = require('can-map');
 *
 *   canMap;
 *   ```
 */
import imports from 'jscodeshift-imports';
import makeDebug from 'debug';

const debug = makeDebug('can-migrate:modern-can-map-replace');

export default function transformer(file, api, options) {
  debug(`Running on ${file.path}`);
  const j = api.jscodeshift;
  const {statement} = j.template;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  let found = false;

  imports.register(j, imports.config.CJSBasicRequire);

  root.find(j.MemberExpression, {
    object: {
      name: 'can'
    },
    property: {
      name: 'Map'
    }
  }).forEach(expression => {
    found = true;
    j(expression).replaceWith(j.identifier('canMap'));
  });

  let useImport = root.find(j.ImportDeclaration).size() > 0;
  let useRequire = root.find(j.CallExpression, {callee: {name: 'require'}}).size() > 0;
  let useConst = root.find(j.VariableDeclaration, {kind: 'const'}).size() > 0;
  debug(`File is using ${useConst ? 'const' : 'var'}`);
  if (!useRequire && !useImport) {
    debug(`File has no imports or requires defaulting to require`);
    useRequire = true;
  }
  debug(`File is using ${useImport ? 'import' : 'require'}`);

  if (found) {
    debug(`Found an instance to replace`);
    if (useImport) {
      root.addImport(statement`
        import canMap from 'can-map';
      `);
    } else {
      if (useConst) {
        root.addImport(statement`
          const canMap = require('can-map');
        `);
      } else {
        root.addImport(statement`
          var canMap = require('can-map');
        `);
      }
    }
  }
  return root.toSource(printOptions);
}
