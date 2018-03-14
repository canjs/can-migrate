'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-route/template.js';
})[0];

describe('can-route template transform', function () {
  it('converts `:foo` to `{foo}` in `route()` calls .js files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/version-4/' + toTest.fileName.replace('.js', '-input.js');
    var outputPath = 'fixtures/version-4/' + toTest.fileName.replace('.js', '-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts `:foo` to `{foo}` in `route.register()` calls .js files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/version-4/' + toTest.fileName.replace('.js', '-input-register.js');
    var outputPath = 'fixtures/version-4/' + toTest.fileName.replace('.js', '-output-register.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});