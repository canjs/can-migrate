import makeDebug from 'debug';
import { typeConversions, find } from '../../../utils/typeUtils';
import { addImport } from '../../../utils/renameImport';
import fileTransform from '../../../utils/fileUtil';

function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-property-definitions/shorthands:${file.path}`);
  const j = api.jscodeshift;

  return fileTransform(file, function (source) {
    const root = j(source);

    // Update `prop: 'string'`
    // into `prop: type.maybeConvert(String)`
    find(root, 'Literal', function (props) {
      return props.forEach(prop => {
          const type = prop.value.value;
          debug(`Converting ${type}`);
          prop.value = typeConversions(type);

          // Add the import
          addImport(j, root, { importName: 'type', hasSiblings: ['ObservableArray', 'ObservableObject', 'StacheElement'] });
      });
    });

    // Update `prop: MyMap`
    // into `prop: type.maybeConvert(MyMapp)`
    find(root, 'Identifier', function (props) {
      return props.forEach(prop => {
          const type = prop.value.name;
          debug(`Converting ${type}`);
          prop.value = typeConversions(type);

          // Add the import
          addImport(j, root, { importName: 'type', hasSiblings: ['ObservableArray', 'ObservableObject', 'StacheElement'] });
      });
    });

    return root.toSource();
  });
}

transformer.forceJavaScriptTransform = true;

export default transformer;