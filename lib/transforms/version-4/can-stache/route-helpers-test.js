'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-stache/route-helpers.js';
})[0];

describe('can-stache-route-helpers', function () {

  it('converts `can-stache/helpers/route` to `can-stache-route-helpers` in .js files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.js');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts `can-stache/helpers/route` to `can-stache-route-helpers` in .stache files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.stache');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output.stache');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});