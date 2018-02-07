'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-stache/attr-from.js';
})[0];

describe('can-stache attr to attr:from transform', function () {

  it('converts `prop="value"` to `prop:from="value"` when not a global element attr', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/version-4/' + toTest.fileName.replace('.js', '-input.stache');
    var outputPath = 'fixtures/version-4/' + toTest.fileName.replace('.js', '-output.stache');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});