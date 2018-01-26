require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-buildFragment/replace.js';
})[0];

describe('can-buildFragment-replace', function() {

  it('replaces all references and adds import dependency', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/${toTest.fileName.replace('.js', '-import-input.js')}`;
    const outputPath = `fixtures/${toTest.fileName.replace('.js', '-import-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('replaces all references and adds require dependency', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/${toTest.fileName.replace('.js', '-require-input.js')}`;
    const outputPath = `fixtures/${toTest.fileName.replace('.js', '-require-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
