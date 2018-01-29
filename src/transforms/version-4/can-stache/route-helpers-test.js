
require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-stache/route-helpers.js';
})[0];

describe('can-stache-route-helpers', function() {

  it('converts `can-stache/helpers/route` to `can-stache-route-helpers` in .js files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts `can-stache/helpers/route` to `can-stache-route-helpers` in .stache files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-input.stache')}`;
    const outputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-output.stache')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
