/**
 * Utility for replacing an import statement of the form:
 *   `import <oldLocalName> from <oldSourceValue>
 * Then it replaces references of <oldLocalName> with the new local name.
 * 
 * Options:
 *   oldSourceValues {Array<String>} possible values for <oldSourceValue>
 *   newSourceValue {String} new source value to use (will replace <oldSourceValue>)
 *   newLocalName {String} new local name (will replace <oldLocalName>)
 */
import makeDebug from 'debug';
import preserveQuote from './preserveQuote';
const debug = makeDebug('can-migrate:replaceRequire');

export default function replaceRequire(j, root, options) {
  if(!options.oldSourceValues || !options.newSourceValue) {
    return;
  }
  let oldLocalName;
  root.find(j.CallExpression, {
    callee: {
      name: 'require'
    }
  }).filter(requireStatement => (
    requireStatement.value.arguments[0].type === 'Literal' && [...options.oldSourceValues].indexOf(requireStatement.value.arguments[0].value) !== -1 
  )).forEach(requireStatement => {
    debug(`Found: require statement, local.name: ${requireStatement.parent.parent.value.declarations ? requireStatement.parent.parent.value.declarations[0].id.name : null}, source.value: ${requireStatement.node.arguments[0].value}`);
    if(requireStatement.parent.parent.value.declarations) {
      oldLocalName = requireStatement.parent.parent.value.declarations[0].id.name;
      debug(`${oldLocalName}, -> ${options.newLocalName}`);
      requireStatement.parent.parent.value.declarations[0].id.name = options.newLocalName;
    }
    debug(`${requireStatement.node.arguments[0].value}, -> ${options.newSourceValue}`);
    requireStatement.node.arguments[0].value = preserveQuote(requireStatement.node.arguments[0].raw, options.newSourceValue);
  });
  return oldLocalName;
}
