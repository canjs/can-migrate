import stache from 'can-stache';

export default function transformer(file) {
  let src = file.source;
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'stache') {
    var renderer = stache(src);
    debugger;
  }

  // src = src.replace('%index', 'scope.index');

  return src;
}
