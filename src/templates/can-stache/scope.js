
export default function transformer(file) {
  let src = file.source;

  src = src.replace(/%index/g, 'scope.index');
  src = src.replace(/%key/g, 'scope.key');
  src = src.replace(/%element/g, 'scope.element');
  src = src.replace(/%event/g, 'scope.event');
  src = src.replace(/%viewModel/g, 'scope.viewModel');
  src = src.replace(/%arguments/g, 'scope.arguments');

  return src;
}
