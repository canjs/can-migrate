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
const debug = makeDebug('can-migrate:replaceImport');

export default function replaceImport(j, root, options) {
  if(!options.oldSourceValues || !options.newSourceValue) {
    return;
  }
  let oldLocalName;
  root.find(j.ImportDeclaration, {}).filter(importStatement => (
    importStatement.value.source.type === 'Literal' && [...options.oldSourceValues].indexOf(importStatement.value.source.value) !== -1
  )).forEach(importStatement => {
    debug(`Found: import statement, local.name: ${importStatement.value.specifiers.length ? importStatement.value.specifiers[0].local.name : null}, source.value: ${importStatement.value.source.value}`);
    if(importStatement.value.specifiers.length > 0) {
      oldLocalName = importStatement.value.specifiers[0].local.name;
      debug(`${oldLocalName}, -> ${options.newLocalName}`);
      importStatement.value.specifiers[0].local.name = options.newLocalName;
    }
    debug(`${importStatement.value.source.value}, -> ${options.newSourceValue}`);
    importStatement.value.source.value = preserveQuote(importStatement.value.source.raw[0], options.newSourceValue);
    
  });
  return oldLocalName;
}
