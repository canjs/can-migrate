
export default function transformer(file) {
  let src = file.source;
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'js') {
    src = src.replace(':page', '{page}');
  }

  return src;
}
