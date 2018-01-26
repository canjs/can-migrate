require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-stache-bindings/colon-bindings.js';
})[0];

describe('can-stache-bindings', function() {
  it('converts bindings in `stache()` calls in .js files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts bindings in `stache()` calls in .js files using implicit bindings', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output-implicit.js')}`;
    utils.diffFiles(fn, inputPath, outputPath, { implicit: true });
  });

  it('converts bindings in .stache files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.stache')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output.stache')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts bindings in .stache files using implicit bindings', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.stache')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output-implicit.stache')}`;
    utils.diffFiles(fn, inputPath, outputPath, { implicit: true });
  });

  it('converts bindings in .md files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.md')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output.md')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts bindings in .md files using implicit bindings', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.md')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output-implicit.md')}`;
    utils.diffFiles(fn, inputPath, outputPath, { implicit: true });
  });

  it('converts bindings in .html files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.html')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output.html')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts bindings in .html files using implicit bindings', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.html')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output-implicit.html')}`;
    utils.diffFiles(fn, inputPath, outputPath, { implicit: true });
  });

  it('converts bindings in .component files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.component')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output.component')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts bindings in .component files using implicit bindings', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-input.component')}`;
    const outputPath = `fixtures/version-3/${toTest.fileName.replace('.js', '-output-implicit.component')}`;
    utils.diffFiles(fn, inputPath, outputPath, { implicit: true });
  });
});
