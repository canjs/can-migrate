import makeDebug from 'debug';
import { typeConversions, find } from '../../../utils/typeUtils';

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-property-definitions/property-definitions:${file.path}`);
  const j = api.jscodeshift;
  const root = j(file.source);

  return find(root, 'ObjectExpression', function (props) {
    return props.forEach(prop => {
      const { nestedProp, propConversions } = prop.value.properties
        .reduce((acc, path) => {
          if (path.value.type === 'Literal' && path.key.name === 'type') {
            acc.nestedProp = path;
          }
          if (['Type', 'Default', 'serialize'].includes(path.key.name)) {
            acc.propConversions.push(path);
          }
          return acc;
        }, { nestedProp: null, propConversions: [] });

      // Convert "types" to maybeConverts
      if (nestedProp) {
        const type = nestedProp.value.value;
        debug(`Converting property ${type} -> ${typeConversions[type]}`);
        nestedProp.value = typeConversions[type];
      }

      // Check for Type && Default to be converted
      // Change serialize to enumerable
      propConversions.forEach(prop => {
        const updatedKey = prop.key.name === 'serialize' ? 'enumerable' : prop.key.name.toLowerCase();
        debug(`Converting key ${prop.key.name} -> ${updatedKey}`);
        prop.key.name = updatedKey;
      });
    });
  })
  .toSource();
}
