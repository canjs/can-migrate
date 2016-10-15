const fs = require('fs');
const path = require('path');
require('mocha');
const assert = require('assert');
const disparity = require('disparity');

const jscodeshift = require('jscodeshift');
// const transforms = require('../');
// console.log(transforms);
// describe('minimal', function() {

// });
const transforms = {
  modern: [{ name: 'can-map/replace.js',
       fileName: 'can-map/replace.js',
       file: '/Users/Curtis/Work/Bitovi/OpenSource/can-migrate-codemods/lib/transforms/modern/can-map/replace.js' }]};
describe('modern', function() {
  transforms.modern.forEach((t) => {
    it(t.name, function() {
      const fn = require(t.file);
      const inputPath = path.join(__dirname, `fixtures/modern/${t.fileName.replace('.js', '-input.js')}`);
      const outputPath = path.join(__dirname, `fixtures/modern/${t.fileName.replace('.js', '-output.js')}`);
      const result = fn({
        path: inputPath,
        source: fs.readFileSync(inputPath, 'utf8')
      }, {
        jscodeshift: jscodeshift,
        stats: function(){}
      }, {
        quote: 'single'
      });

      console.log('\n\n', result, '\n\n');

      const diff = disparity.unified(fs.readFileSync(outputPath, 'utf8').trim(), result.trim(), {
        paths: [
          `${inputPath} (transformed)`,
          outputPath
        ]
      });

      assert.equal(diff, '', `\n${diff}`);
    });
  });
});

// describe('future', function() {

// });
