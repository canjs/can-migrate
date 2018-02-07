
require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-stache/attr-from.js';
})[0];

describe('can-stache attr to attr:from transform', function() {

  it('converts `prop="value"` to `prop:from="value"` when not a global element attr', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-input.stache')}`;
    const outputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-output.stache')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
