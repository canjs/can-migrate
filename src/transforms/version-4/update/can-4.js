
import scope from '../can-stache/scope';
import page from '../can-route/page';
import register from '../can-route/register';
import routeHelpers from '../can-stache/route-helpers';
import consoleLog from '../can-stache/console-log';

export default function transformer(file) {
  let src = file.source;

  src = scope(src);
  src = page(src);
  src = register(src);
  src = routeHelpers(src);
  src = consoleLog(src);

  return src;
}
