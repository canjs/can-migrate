import makeDebug from 'debug';
import getConfig from '../../../utils/getConfig';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-property-definitions/observable-object-default-propertydefaults:${file.path}`);
  const j = api.jscodeshift;
  const config = getConfig(options.config);
  const extendedClassName = config.moduleToName['can-define-object'];

  // Transform different file types
  return fileTransform(file, function (source) {
    const root = j(source);

    root
      .find(j.ClassDeclaration, {
        superClass: {
          name: extendedClassName
        }
      })
      .forEach(path => {
        const propertyDefaults = j(path).find(j.MethodDefinition, {
          key: {
            name: 'propertyDefaults'
          },
          kind: 'get',
          static: true
        });
        // Only create a propertyDefault if the instance doesn't already have one
        if (!propertyDefaults.length) {
          debug('Setting propertyDefaults to "DeepObservable"');

          path.value.body.body.push(
            j.methodDefinition(
              'get',
              j.identifier('propertyDefaults'),
              j.functionExpression(
                null,
                [],
                j.blockStatement([j.returnStatement(j.identifier('DeepObservable'))])
              ),
              true
            )
          );

          // Add the import
          const importSource = 'can-deep-observable';
          const importName = j.identifier('DeepObservable');
          const specifier = j.importDefaultSpecifier(importName);
          const addImport = j.importDeclaration([specifier], j.literal('can-deep-observable'));

          const imports = root.find(j.ImportDeclaration);
          const observableImports = imports.filter(path => {
            return path.value.source.value === importSource;
          });
          if (imports.length && !observableImports.length) {
            // Add after last import statement
            const path = j(imports.at(imports.length - 1).get()).get();
            j(path).replaceWith(j.template.statements`
              ${path.value}
              ${addImport}
            `);
          } else if (!imports.length) {
            // Add to beginning if we don't have imports.. which is unlikely
            root.get().node.program.body.unshift(addImport);
          }
        }
      });

      return root.toSource();
    });
}

transformer.forceJavaScriptTransform = true;

export default transformer;
