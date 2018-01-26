'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-route/page.js';
})[0];

describe('can-route page transform', function () {

  it('converts `:page` to `{page}` in .js files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/version-4/' + toTest.fileName.replace('.js', '-input.js');
    var outputPath = 'fixtures/version-4/' + toTest.fileName.replace('.js', '-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});