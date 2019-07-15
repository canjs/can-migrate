import j from 'jscodeshift';

const maybeConvert = (val) => j.callExpression(
  j.memberExpression(
    j.identifier('type'),
    j.identifier('maybeConvert')
  ),
  [j.identifier(val)]
);

const conversions = {
  'string': maybeConvert('String'),
  'number': maybeConvert('Number'),
  'date': maybeConvert('Date'),
  'boolean': maybeConvert('Boolean'),
  'any': j.memberExpression(
    j.identifier('type'),
    j.identifier('Any')
  )
};

// Convert known types and unknown types into type.maybeConvert's
export const typeConversions = (type) => {
  // Known primitive types
  if (conversions[type]) {
    return conversions[type];
  } else {
    // Unkown's should be converted
    // prop: MyMap
    // converts into
    // prop: type.maybeConvert(MyMap)
    return maybeConvert(type);
  }
};

export const find = (root, type, cb = () => {}) => {
  return root
    .find(j.MethodDefinition, {
      key: {
        name: 'define'
      },
      kind: 'get',
      static: true
    })
    .forEach(path => {
      const props = path.value.value.body.body.length ? path.value.value.body.body[0].argument.properties : [];
      const topLevelProps = props.filter(p => p.value.type === type);

      return cb(topLevelProps, path);
    });
};
