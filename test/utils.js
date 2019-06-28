const fs = require('fs');
const path = require('path');
const assert = require('assert');
const disparity = require('disparity');
const jscodeshift = require('jscodeshift');

function diffFiles(fn, inputPath, outputPath, options = {}) {
  const result = fn({
    path: path.join(__dirname, inputPath),
    source: fs.readFileSync(path.join(__dirname, inputPath), 'utf8')
  }, {
      jscodeshift: jscodeshift,
      stats: function () { }
    }, Object.assign({}, {
      printOptions: {
        quote: 'single'
      }
    }, options));

  // console.log('\n\n', result, '\n\n');

  const diff = disparity.unified(result.trim(), fs.readFileSync(path.join(__dirname, outputPath), 'utf8').trim(), {
    paths: [
      `${inputPath} (transformed)`,
      outputPath
    ]
  });

  assert.equal(diff, '', `\n${diff}`);
}

module.exports.diffFiles = diffFiles;
