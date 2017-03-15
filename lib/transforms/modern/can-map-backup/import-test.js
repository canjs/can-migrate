'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.modern.filter(function (transform) {
  return transform.name === 'can-map-backup/import.js';
})[0];

describe('can-map-backup-import', function () {

  it('replaces import dependencies and references', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/modern/' + toTest.fileName.replace('.js', '-input.js');
    var outputPath = 'fixtures/modern/' + toTest.fileName.replace('.js', '-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});