import makeDebug from 'debug';
import { typeConversions, find } from '../../../utils/typeUtils';

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-types/property-definitions:${file.path}`);
  const j = api.jscodeshift;
  const root = j(file.source);

  return find(root, 'ObjectExpression', function (props) {
    return props.forEach(prop => {
      const { nestedProp, capPropConversions } = prop.value.properties
        .reduce((acc, path) => {
          if (path.value.type === 'Literal' && path.key.name === 'type') {
            acc.nestedProp = path;
          }
          if (['Type', 'Default'].includes(path.key.name)) {
            acc.capPropConversions.push(path);
          }
          return acc;
        }, { nestedProp: null, capPropConversions: [] });

      // Convert "types" to maybeConverts
      if (nestedProp) {
        const type = nestedProp.value.value;
        debug(`Converting property ${type} -> ${typeConversions[type]}`);
        nestedProp.value = typeConversions[type];
      }

      // Check for Type && Default to be converted
      capPropConversions.forEach(prop => {
        debug(`Converting key ${prop.key.name} -> ${prop.key.name.toLowerCase()}`);
        prop.key.name = prop.key.name.toLowerCase();
      });
    });
  })
  .toSource();
}
