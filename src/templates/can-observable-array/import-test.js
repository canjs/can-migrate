require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-observable-array/import.js';
})[0];

describe('can-observable-array', function() {

  it('Renames can-define/list import to can-observable-array', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.html')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.html')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Renames can-define/list import to can-observable-array deconstructed', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input-deconstructed.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output-deconstructed.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
