
require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-define/default.js';
})[0];

describe('can-define forEach transform', function() {
  it('converts `each()` to `forEach()` only for DefineMap and DefineList instances', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
