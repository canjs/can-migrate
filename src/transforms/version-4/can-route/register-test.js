
require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-route/register.js';
})[0];

describe('can-route register transform', function() {

  it('converts `route()` to `route.register()` in .js files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
