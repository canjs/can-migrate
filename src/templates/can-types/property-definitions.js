import makeDebug from 'debug';
import { typeConversions, find } from '../../../utils/typeUtils';

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-types/property-definitions:${file.path}`);
  const j = api.jscodeshift;
  const root = j(file.source);

  return find(root, 'ObjectExpression', function (props) {
    return props.forEach(prop => {
      // Convert "types" to maybeConverts
      const nestedProps = prop.value.properties.filter(p => p.value.type === 'Literal' && p.key.name === 'type');
      if (nestedProps.length === 1) {
        const type = nestedProps[0].value.value;
        debug(`Converting ${type} -> ${typeConversions[type]}`);
        nestedProps[0].value = typeConversions[type];
      }
    });
  })
  .toSource();
}
