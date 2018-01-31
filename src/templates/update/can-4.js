
import scope from '../can-stache/scope';
import page from '../can-route/page';
import register from '../can-route/register';
import start from '../can-route/start';
import routeHelpers from '../can-stache/route-helpers';
import consoleLog from '../can-stache/console-log';
import batch from '../can-queues/batch';
import valueToDefault from '../can-define/default';

export default function transformer(file, api, options) {
  let src = file.source;

  src = scope(src);
  src = page(src);
  src = register(src);
  src = start(src);
  src = routeHelpers(src);
  src = consoleLog(src);
  src = batch(file, api, options);
  src = valueToDefault(src);

  return src;
}
