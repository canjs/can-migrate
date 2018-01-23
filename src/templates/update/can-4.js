
import scope from '../can-stache/scope';

export default function transformer(file) {
  let src = file.source;
  src = scope(src);
  return src;
}
