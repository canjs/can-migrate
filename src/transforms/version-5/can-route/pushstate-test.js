
require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-route/pushstate.js';
})[0];

describe('can-route-pushstate transform', function() {
  it('sets route.urlData to new RoutePushstate', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/version-5/${toTest.fileName.replace('.js', '-input.js')}`;
    const outputPath = `fixtures/version-5/${toTest.fileName.replace('.js', '-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
