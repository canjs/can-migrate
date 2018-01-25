
import scope from '../can-stache/scope';
import page from '../can-route/page';
import register from '../can-route/register';
import batch from '../can-queues/batch';

export default function transformer(file, api, options) {
  let src = file.source;

  src = scope(src);
  src = page(src);
  src = register(src);
  src = batch(file, api, options);
  return src;
}
