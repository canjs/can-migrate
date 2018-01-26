'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

console.log('>>', transforms);

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-component-rename/can-component-rename.js';
})[0];

describe('can-component-rename', function () {

  it('Renames Component properties', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.js');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('Handles no component', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input-no-component.js');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output-no-component.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });
});