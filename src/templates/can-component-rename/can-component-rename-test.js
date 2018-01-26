require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-component-rename/can-component-rename.js';
})[0];

describe('can-component-rename', function() {

  it('Renames Component properties', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Handles no component', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/${toTest.fileName.replace('.js', '-input-no-component.js')}`;
    const outputPath = `fixtures/${toTest.fileName.replace('.js', '-output-no-component.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
