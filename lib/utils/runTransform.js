'use strict';

var path = require('path');
var execa = require('execa');
var fs = require('fs');
var stream = require('stream');

var noop = function noop() {
  return this;
};
var mockRoot = function mockRoot(source) {
  this.source = source;
};
mockRoot.prototype.find = noop;
mockRoot.prototype.toSource = function () {
  return this.source;
};
mockRoot.prototype.forEach = noop;
mockRoot.prototype.filter = noop;
var mockJscodeshift = function mockJscodeshift(source) {
  return new mockRoot(source);
};
mockJscodeshift.CallExperssion = noop;
mockJscodeshift.Identifier = noop;
mockJscodeshift.identifier = noop;
mockJscodeshift.literal = noop;
mockJscodeshift.property = noop;

var mockApi = {
  jscodeshift: mockJscodeshift
};

function getReadableTransformName(transformFile) {
  var file = transformFile.split('.js')[0];
  var parts = file.split('lib/transforms/');
  return parts[1];
}

function getResultCountFromString(count) {
  count = count[0].split(' ')[0] || 0;
  return +count;
}

function parseJsCodeShiftResults(results) {
  var errors = getResultCountFromString(results.match(/(\d)* errors./));
  var unmodified = getResultCountFromString(results.match(/(\d)* unmodified./));
  var skipped = getResultCountFromString(results.match(/(\d)* skipped./));
  var ok = getResultCountFromString(results.match(/(\d)* ok./));

  var total = errors + unmodified + skipped + ok;

  return ok + ' / ' + total + ' files modified (' + errors + ' errors).';
}

function runTransform(transform, paths, args, apply) {
  var jscodeshiftPath = require.resolve('.bin/jscodeshift');
  var transformFunc = require(transform.file);

  if (args.indexOf('-s') < 0) {
    console.log('Running transform: ' + getReadableTransformName(transform.file) + '.');
  }

  var jsPaths = [];
  var otherPaths = [];

  var otherPathsResults = {
    ok: 0,
    total: 0,
    errors: 0
  };

  for (var i = 0; i < paths.length; i++) {
    if (path.extname(paths[i]) === '.js') {
      jsPaths.push(paths[i]);
    } else {
      otherPaths.push(paths[i]);
    }
  }

  // Run the transform on non-js files
  for (var _i = 0; _i < otherPaths.length; _i++) {
    var file = {
      path: otherPaths[_i],
      source: fs.readFileSync(otherPaths[_i], 'utf8')
    };
    var options = {};
    var newSource = transformFunc(file, mockApi, options);
    // Write changes to file if apply specified
    if (newSource !== file.source && apply) {
      otherPathsResults.ok++;
      fs.writeFileSync(file.path, newSource);
    }

    otherPathsResults.total++;
  }

  if (jsPaths.length) {
    args = args.concat(jsPaths);

    var resultsStream = new stream.Writable();
    resultsStream._write = function (chunk, encoding, done) {
      var msg = chunk.toString();
      if (args.indexOf('-s') < 0) {
        if (msg.indexOf('Results:') > -1) {
          console.log(parseJsCodeShiftResults(msg));
        }
      }
      done();
    };

    var execaStream = execa(jscodeshiftPath, args);

    // pipe console messages from jsCodeShift through custom writable stream
    // so we can aggregate the results
    execaStream.stdout.pipe(resultsStream);

    return execaStream.then(function () {}).catch(console.error.bind(console));
  } else {
    if (args.indexOf('-s') < 0) {
      console.log(otherPathsResults.ok + ' / ' + otherPathsResults.total + ' files modified (' + otherPathsResults.errors + ' errors).');
    }

    return Promise.resolve();
  }
}

module.exports = runTransform;