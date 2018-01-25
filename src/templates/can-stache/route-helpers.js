
export default function transformer(file) {
  let src = file.source;
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'js' || type === 'stache') {
    src = src.replace('can-stache/helpers/route', 'can-stache-route-helpers');
  }

  return src;
}
