require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'variable-declaration/chained-declaration.js';
})[0];

describe('variable-declaration/chained-declaration', function() {

  it('splits chained var declaration', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-6/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
