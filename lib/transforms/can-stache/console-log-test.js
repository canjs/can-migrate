'use strict';

require('mocha');
var utils = require('../../../test/utils');
var transforms = require('../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-stache/console-log.js';
})[0];

describe('can-stache console.log() transform', function () {

  it('converts `{{log}}` to `{{console.log(this)}}` in stache files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.stache');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output.stache');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});