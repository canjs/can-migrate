
var transformStache = function (src) {
  src = src.replace('%index', 'scope.index');
  src = src.replace('%key', 'scope.key');
  src = src.replace('%element', 'scope.element');
  src = src.replace('%event', 'scope.event');
  src = src.replace('%viewModel', 'scope.viewModel');
  src = src.replace('%arguments', 'scope.arguments');

  return src;
};

export default function transformer(file) {
  let src = file.source;

  src = transformStache(src);

  return src;
}
