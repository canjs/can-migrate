require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-property-definitions/observable-object-default-propertydefaults.js';
})[0];

describe('can-property-definitions/observable-object-default-propertydefaults', function() {

  it('will set propertyDefaults if not already set', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('runs in .html files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.html')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.html')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
