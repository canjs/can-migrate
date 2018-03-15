
require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-route/template.js';
})[0];

describe('can-route template transform', function() {
  it('converts `:foo` to `{foo}` in `route()` calls .js files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts `:foo` to `{foo}` in `route.register()` calls .js files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-input-register.js')}`;
    const outputPath = `fixtures/version-4/${toTest.fileName.replace('.js', '-output-register.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
