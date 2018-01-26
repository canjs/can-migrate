'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-queues/batch.js';
})[0];

describe('can-queues batch transform', function () {
  it('converts canBatch.start/stop to queues.batch.start/stop in ESM files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-esm-input.js');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-esm-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts canBatch.start/stop to queues.batch.start/stop in CJS files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-cjs-input.js');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-cjs-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});