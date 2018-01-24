
import scope from '../can-stache/scope';
import page from '../can-route/page';
import register from '../can-route/register';

export default function transformer(file) {
  let src = file.source;

  src = scope(src);
  src = page(src);
  src = register(src);
  return src;
}
