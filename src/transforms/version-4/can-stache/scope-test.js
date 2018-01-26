
require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-stache/scope.js';
})[0];

describe('can-stache scope transform', function() {

  it('converts `%special` to `scope.special` in all files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/${toTest.fileName.replace('.js', '-input.stache')}`;
    const outputPath = `fixtures/${toTest.fileName.replace('.js', '-output.stache')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
