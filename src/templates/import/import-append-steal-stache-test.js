require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'import/import-append-steal-stache.js';
})[0];

describe('import stache with steal-stache', function() {
  let fn;
  before(() => {
    fn = require(toTest.file);
  });


  it('replaces import dependencies (js)', function() {
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('replaces import dependencies (stache)', function() {
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.stache')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output.stache')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
