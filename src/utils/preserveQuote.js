/**
 * Utility for creating a new string with the same quotes as the old string.
 * Uses the approach explained here:
 * https://github.com/benjamn/recast/issues/171#issuecomment-224996336
 * 
 * Options:
 *   oldSourceValues {Array<String>} possible values for <oldSourceValue>
 *   newSourceValue {String} new source value to use (will replace <oldSourceValue>)
 *   newLocalName {String} new local name (will replace <oldLocalName>)
 */
import jsesc from 'jsesc';

export default function preserveQuote(raw, newStr) {
  const quote = raw[0];
  const value = jsesc(newStr, {quotes: quote === '\'' ? 'single' : 'double'});
  const literal = quote + value + quote;
  return new String(literal); // jshint ignore:line
}
