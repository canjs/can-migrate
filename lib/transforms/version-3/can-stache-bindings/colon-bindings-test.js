'use strict';

require('mocha');
var utils = require('../../../../test/utils');
var transforms = require('../../../../');

var toTest = transforms.filter(function (transform) {
  return transform.name === 'can-stache-bindings/colon-bindings.js';
})[0];

describe('can-stache-bindings', function () {
  it('converts bindings in `stache()` calls in .js files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.js');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output.js');
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts bindings in `stache()` calls in .js files using implicit bindings', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.js');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output-implicit.js');
    utils.diffFiles(fn, inputPath, outputPath, { implicit: true });
  });

  it('converts bindings in .stache files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.stache');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output.stache');
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts bindings in .stache files using implicit bindings', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.stache');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output-implicit.stache');
    utils.diffFiles(fn, inputPath, outputPath, { implicit: true });
  });

  it('converts bindings in .md files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.md');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output.md');
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts bindings in .md files using implicit bindings', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.md');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output-implicit.md');
    utils.diffFiles(fn, inputPath, outputPath, { implicit: true });
  });

  it('converts bindings in .html files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.html');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output.html');
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts bindings in .html files using implicit bindings', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.html');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output-implicit.html');
    utils.diffFiles(fn, inputPath, outputPath, { implicit: true });
  });

  it('converts bindings in .component files', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.component');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output.component');
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts bindings in .component files using implicit bindings', function () {
    var fn = require(toTest.file);
    var inputPath = 'fixtures/' + toTest.fileName.replace('.js', '-input.component');
    var outputPath = 'fixtures/' + toTest.fileName.replace('.js', '-output-implicit.component');
    utils.diffFiles(fn, inputPath, outputPath, { implicit: true });
  });
});