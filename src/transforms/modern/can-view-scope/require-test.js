require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.modern.filter(function(transform) {
  return transform.name === 'can-view-scope/require.js';
})[0];

describe('can-view-scope-require', function() {

  it('replaces require dependencies and references', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/modern/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/modern/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
