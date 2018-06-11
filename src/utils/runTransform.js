
const path = require('path');
const execa = require('execa');
const fs = require('fs');
const stream = require('stream');

let noop = function() { return this; };
let mockRoot = function(source) { this.source = source; };
mockRoot.prototype.find = noop;
mockRoot.prototype.toSource = function() { return this.source; };
mockRoot.prototype.forEach = noop;
mockRoot.prototype.filter = noop;
let mockJscodeshift = function(source) { return new mockRoot(source); };
mockJscodeshift.CallExperssion = noop;
mockJscodeshift.Identifier = noop;
mockJscodeshift.identifier = noop;
mockJscodeshift.literal = noop;
mockJscodeshift.property = noop;

const mockApi = {
  jscodeshift: mockJscodeshift
};

function getReadableTransformName(transformFile) {
  const file = transformFile.split('.js')[0];
  const parts = file.split('lib/transforms/');
  return parts[1];
}

function getResultCountFromString(count) {
  count = count[0].split(' ')[0] || 0;
  return +count;
}

function parseJsCodeShiftResults(results) {
  const errors = getResultCountFromString(results.match(/(\d)* errors./));
  const unmodified = getResultCountFromString(results.match(/(\d)* unmodified./));
  const skipped = getResultCountFromString(results.match(/(\d)* skipped./));
  const ok = getResultCountFromString(results.match(/(\d)* ok./));

  const total = errors + unmodified + skipped + ok;

  return `${ok} / ${total} files modified (${errors} errors).`;
}

function runTransform(transform, paths, args, apply) {
  const jscodeshiftPath = require.resolve('.bin/jscodeshift');
  const transformFunc = require(transform.file);

  if (args.indexOf('-s') < 0) {
    console.log(`Running transform: ${getReadableTransformName(transform.file)}.`);
  }

  let jsPaths = [];
  let otherPaths = [];

  for (let i = 0; i < paths.length; i++) {
    if(path.extname(paths[i]) === '.js') {
      jsPaths.push(paths[i]);
    }
    else {
      otherPaths.push(paths[i]);
    }
  }

  // Run the transform on non-js files
  for (let i = 0; i < otherPaths.length; i++) {
    let file = {
      path: otherPaths[i],
      source: fs.readFileSync(otherPaths[i], 'utf8')
    };
    let options = {};
    let newSource = transformFunc(file, mockApi, options);
    // Write changes to file if apply specified
    if (newSource !== file.source && apply) {
      fs.writeFileSync(file.path, newSource);
    }
  }

  args = args.concat(jsPaths);

  const resultsStream = new stream.Writable();
  resultsStream._write = function (chunk, encoding, done) {
    const msg = chunk.toString();
    if (args.indexOf('-s') < 0) {
      if (msg.indexOf('Results:') > -1) {
        console.log(parseJsCodeShiftResults(msg));
      }
    }
    done();
  };

  const execaStream = execa(jscodeshiftPath, args);

  // pipe console messages from jsCodeShift through custom writable stream
  // so we can aggregate the results
  execaStream.stdout.pipe(resultsStream);

  return execaStream
    .then(function() {})
    .catch(console.error.bind(console));
}

module.exports = runTransform;
