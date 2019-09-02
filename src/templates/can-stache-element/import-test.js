require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-stache-element/import.js';
})[0];

describe('can-stache-element/import', function() {

  it('Renames can-component import to can-stache-element', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Renames can-component import to can-stache-element deconstructed', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input-deconstructed.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output-deconstructed.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Renames can-component import to can-stache-element .html', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.html')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.html')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
