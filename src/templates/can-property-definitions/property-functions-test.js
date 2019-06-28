require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-property-definitions/property-functions.js';
})[0];

describe('can-property-definitions/property-functions', function() {

  it('Moves functions from static define into class body', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
