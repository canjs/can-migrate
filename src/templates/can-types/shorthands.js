import getConfig from '../../../utils/getConfig';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-types/shorthands:${file.path}`);
  const config = getConfig(options.config);
  const j = api.jscodeshift;

  const maybeConvert = (val) => j.callExpression(
    j.memberExpression(
      j.identifier('type'),
      j.identifier('maybeConvert')
    ),
    [j.identifier(val)]
  );
  const typeConversions = {
    'string': maybeConvert('String'),
    'number': maybeConvert('Number'),
    'date': maybeConvert('Date'),
    'boolean': maybeConvert('Boolean'),
    'any': j.memberExpression(
      j.identifier('type'),
      j.identifier('Any')
    )
  };

  return j(file.source)
    .find(j.MethodDefinition, {
      key: {
        name: 'define'
      },
      kind: 'get',
      static: true
    })
    .forEach(path => {
      const props = path.value.value.body.body[0].argument.properties;
      const topLevelProps = props.filter(p => p.value.type === 'Literal');

      topLevelProps.forEach(prop => {
        const type = prop.value.value;
        prop.value = typeConversions[type];
      });
    })
    .toSource();
}
