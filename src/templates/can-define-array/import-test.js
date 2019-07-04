require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-define-array/import.js';
})[0];

describe('can-define-array', function() {

  it('Renames can-define/list import to can-define-array', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Renames can-define/list import to can-define-array deconstructed', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input-deconstructed.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output-deconstructed.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
