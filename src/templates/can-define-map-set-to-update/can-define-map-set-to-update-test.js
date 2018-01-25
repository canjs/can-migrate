require('mocha');
const utils = require('../../../test/utils');
const transforms = require('../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-define-map-set-to-update/can-define-map-set-to-update.js';
})[0];

describe('can-define-map-set-to-update', function() {

  it('replaces all references', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/${toTest.fileName.replace('.js', '-test-input.js')}`;
    const outputPath = `fixtures/${toTest.fileName.replace('.js', '-test-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });


});
