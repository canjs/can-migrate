require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-observable-object/observable-object.js';
})[0];

describe('can-observable-object/observable-object', function() {

  it('Converts DefineMap.extend to class extends ObservableObject', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Converts DefineMap.extend to class extends ObservableObject in .md files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.md')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.md')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Converts inline DefineMap.extend to class extends ObservableObject', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-inline-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-inline-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Convert DefineMap static propeties to ObservableObject static properties', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-static-properties-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-static-properties-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
