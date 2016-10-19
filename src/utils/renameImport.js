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
import importUtils from './importUtils';

export default function replaceImport(ast, options) {
  if(!options.oldSourceValues || !options.newSourceValue) {
    return;
  }
  let oldLocalName;
  importUtils.find(ast, options.oldSourceValues)
  .forEach(importStatement => {
    oldLocalName = importUtils.rename(importStatement, options.newSourceValue, options.newLocalName);
  });
  return oldLocalName;
}
