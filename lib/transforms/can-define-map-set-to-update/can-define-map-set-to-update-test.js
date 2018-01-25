'use strict';

require('mocha');
var utils = require('../../../test/utils');
var transforms = require('../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-define-map-set-to-update/can-define-map-set-to-update.js';
})[0];

describe('can-define-map-set-to-update', function () {

  it('replaces all references', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-test-input.js');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-test-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});