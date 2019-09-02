import makeDebug from 'debug';
import getConfig from '../../../utils/getConfig';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-property-definitions/observable-default-propertydefaults:${file.path}`);
  const j = api.jscodeshift;
  const config = getConfig(options.config);
  const extendedObjectClassName = config.moduleToName['can-observable-object'];
  const extendedArrayClassName = config.moduleToName['can-observable-array'];
  const extendedStacheClassName = config.moduleToName['can-stache-element'];
  const propertyDefaultDeepObservable = config.moduleToName['can-deep-observable'];

  // Transform different file types
  return fileTransform(file, function (source) {
    const root = j(source);

    // Update ObservableObject
    root
      .find(j.ClassDeclaration, {
        superClass: {
          name: extendedObjectClassName
        }
      })
      .forEach(path => checkAndAddPropertyDefaults({ j, debug, path, root, propertyDefaultDeepObservable, defaultName: 'propertyDefaults' }));

      // Update ObservableArray
      root
      .find(j.ClassDeclaration, {
        superClass: {
          name: extendedArrayClassName
        }
      })
      .forEach(path => checkAndAddPropertyDefaults({ j, debug, path, root, propertyDefaultDeepObservable, defaultName: 'items' }));

      // Update StacheElement
      root
      .find(j.ClassDeclaration, {
        superClass: {
          name: extendedStacheClassName
        }
      })
      .forEach(path => checkAndAddPropertyDefaults({ j, debug, path, root, propertyDefaultDeepObservable, defaultName: 'propertyDefaults' }));
      // Use ClassExpression when the class is exported ie: module.exports = class MyApp extends StacheElement {}
      root
      .find(j.ClassExpression, {
        superClass: {
          name: extendedStacheClassName
        }
      })
      .forEach(path => checkAndAddPropertyDefaults({ j, debug, path, root, propertyDefaultDeepObservable, defaultName: 'propertyDefaults' }));

      return root.toSource();
    });
}

function addImport ({ j, importName, root }) {
  // Add the import
  const importSource = 'can-deep-observable';
  const importNameIdentifier = j.identifier(importName);
  const specifier = j.importDefaultSpecifier(importNameIdentifier);
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

function checkAndAddPropertyDefaults ({ j, debug, path, root, propertyDefaultDeepObservable, defaultName }) {
  const propertyDefaults = j(path).find(j.MethodDefinition, {
    key: {
      name: defaultName
    },
    kind: 'get',
    static: true
  });
  // Only create a propertyDefault if the instance doesn't already have one
  if (!propertyDefaults.length) {
    debug(`Setting items to "${propertyDefaultDeepObservable}"`);

    path.value.body.body.push(
      j.methodDefinition(
        'get',
        j.identifier(defaultName),
        j.functionExpression(
          null,
          [],
          j.blockStatement([j.returnStatement(j.identifier(propertyDefaultDeepObservable))])
        ),
        true
      )
    );

    addImport({ j, root, importName: propertyDefaultDeepObservable });
  }
}

transformer.forceJavaScriptTransform = true;

export default transformer;
