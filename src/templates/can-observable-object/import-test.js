require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-observable-object/import.js';
})[0];

describe('can-observable-object/import', function() {

  it('Renames can-define/map import to can-observable-object', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Renames can-define/map import to can-observable-object deconstructed', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input-deconstructed.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output-deconstructed.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Renames can-define/map import to can-observable-object in .md files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.md')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.md')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
