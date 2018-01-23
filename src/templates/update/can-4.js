
import scope from '../can-stache/scope';
import page from '../can-route/page';

export default function transformer(file) {
  let src = file.source;

  src = scope(src);
  src = page(src);
  
  return src;
}
