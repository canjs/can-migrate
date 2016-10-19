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
import requireUtils from './requireUtils';

export default function replaceRequire(ast, options) {
  if(!options.oldSourceValues || !options.newSourceValue) {
    return;
  }
  let oldLocalName;
  requireUtils.find(ast, options.oldSourceValues)
  .forEach(requireStatement => {
    oldLocalName = requireUtils.rename(requireStatement, options.newSourceValue, options.newLocalName);
  });
  return oldLocalName;
}
