require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-stache/console-log.js';
})[0];

describe('can-stache console.log() transform', function() {

  it('converts `{{log}}` to `{{console.log(this)}}` in stache files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/${toTest.fileName.replace('.js', '-input.stache')}`;
    const outputPath = `fixtures/${toTest.fileName.replace('.js', '-output.stache')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
