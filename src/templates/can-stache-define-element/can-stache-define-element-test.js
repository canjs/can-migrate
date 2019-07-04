require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-stache-define-element/can-stache-define-element.js';
})[0];

describe('can-stache-define-element', function() {

  it('Converts Component.extend to class extends StacheDefineElement', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Converts Component.extend to class extends StacheDefineElement in .md files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.md')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.md')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Converts Component.extend to class extends StacheDefineElement in .html files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.html')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.html')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
