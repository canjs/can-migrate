'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-getObject/replace.js';
})[0];

describe('can-getObject-replace', function () {

  it('replaces all references and adds import dependency', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/version-3/' + toTest.fileName.replace('.js', '-import-input.js');
    var outputPath = 'fixtures/version-3/' + toTest.fileName.replace('.js', '-import-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('replaces all references and adds require dependency', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/version-3/' + toTest.fileName.replace('.js', '-require-input.js');
    var outputPath = 'fixtures/version-3/' + toTest.fileName.replace('.js', '-require-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});