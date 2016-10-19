require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.modern.filter(function(transform) {
  return transform.name === 'can-event/import.js';
})[0];

describe('can-event-import', function() {

  it('replaces import dependencies', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/modern/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/modern/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('replaces import dependencies and references', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/modern/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/modern/${toTest.fileName.replace('.js', '-output-replace.js')}`;
    utils.diffFiles(fn, inputPath, outputPath, {
      replace: true
    });
  });
});
