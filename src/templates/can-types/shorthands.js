import makeDebug from 'debug';
import { typeConversions, find } from '../../../utils/typeUtils';

export default function transformer(file, api) {
  const debug = makeDebug(`can-migrate:can-types/shorthands:${file.path}`);
  const j = api.jscodeshift;
  const root = j(file.source);

  return find(root, 'Literal', function (props) {
    return props.forEach(prop => {
        const type = prop.value.value;
        debug(`Converting ${type} -> ${typeConversions[type]}`);
        prop.value = typeConversions[type];
    });
  })
  .toSource();
}
