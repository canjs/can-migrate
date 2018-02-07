'use strict';

var path = require('path');
var execa = require('execa');
var fs = require('fs');

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

function runTransform(transform, paths, args, apply) {
  var jscodeshiftPath = require.resolve('.bin/jscodeshift');
  var transformFunc = require(transform.file);

  var jsPaths = [];
  var otherPaths = [];

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
    if (apply) {
      fs.writeFileSync(file.path, newSource);
    }
  }

  args = args.concat(jsPaths);

  return execa(jscodeshiftPath, args, { stdio: 'inherit' }).then(function () {}).catch(console.error.bind(console));
}

module.exports = runTransform;