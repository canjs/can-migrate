require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-map-define/require.js';
})[0];

describe('can-map-define-require', function() {

  it('replaces require dependencies and references', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
