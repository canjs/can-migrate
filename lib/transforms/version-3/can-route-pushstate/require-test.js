'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-route-pushstate/require.js';
})[0];

describe('can-route-pushstate-require', function () {

  it('replaces require dependencies and references', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/version-3/' + toTest.fileName.replace('.js', '-input.js');
    var outputPath = 'fixtures/version-3/' + toTest.fileName.replace('.js', '-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});