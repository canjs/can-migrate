
export default function transformer(file, api) {
  let j = api.jscodeshift;
  let root = j(file.source);

  return root.toSource();
}
