
export default function transformer(file) {
  let src = file.source;

  src = src.replace('can-stache/helpers/route', 'can-stache-route-helpers');

  return src;
}
