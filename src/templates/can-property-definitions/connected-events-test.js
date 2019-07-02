require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-property-definitions/connected-events.js';
})[0];

describe('can-property-definitions/connected-events', function() {

  it('transforms connected/events into can-control', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('transforms connected/events into can-control in .md files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.md')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.md')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
