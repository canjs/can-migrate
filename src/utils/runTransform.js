
const path = require('path');
const execa = require('execa');
const fs = require('fs');

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

function runTransform(transform, paths, args, apply) {
  const jscodeshiftPath = require.resolve('.bin/jscodeshift');
  const transformFunc = require(transform.file);

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

  return execa(jscodeshiftPath, args, { stdio: 'inherit' }).then(() => {
  }).catch(console.error.bind(console));
}

module.exports = runTransform;
