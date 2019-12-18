require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-stache-element/can-stache-element.js';
})[0];

describe('can-stache-element', function() {

  it('Converts Component.extend to class extends StacheElement', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Converts Component.extend to class extends StacheElement in .md files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.md')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.md')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Converts Component.extend to class extends StacheElement in .html files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.html')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.html')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Converts Component.extend to class extends StacheElement when can-component imported with other name', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-other-name-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-other-name-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
