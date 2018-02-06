'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-define/for-each.js';
})[0];

describe('can-define forEach transform', function () {
  it('converts `each()` to `forEach()` only for DefineMap and DefineList instances', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/version-4/' + toTest.fileName.replace('.js', '-input.js');
    var outputPath = 'fixtures/version-4/' + toTest.fileName.replace('.js', '-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});