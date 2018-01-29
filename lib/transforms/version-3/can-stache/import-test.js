'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-stache/import.js';
})[0];

describe('can-stache-import', function () {

  it('replaces import dependencies and references', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/version-3/' + toTest.fileName.replace('.js', '-input.js');
    var outputPath = 'fixtures/version-3/' + toTest.fileName.replace('.js', '-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});