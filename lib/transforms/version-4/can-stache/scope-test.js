'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-stache/scope.js';
})[0];

describe('can-stache scope transform', function () {

  it('converts `%special` to `scope.special` in all files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.stache');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output.stache');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});