require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === 'can-queues/batch.js';
})[0];

describe('can-queues batch transform', function() {
  it('converts canBatch.start/stop to queues.batch.start/stop in ESM files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/${toTest.fileName.replace('.js', '-esm-input.js')}`;
    const outputPath = `fixtures/${toTest.fileName.replace('.js', '-esm-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

  it('converts canBatch.start/stop to queues.batch.start/stop in CJS files', function() {
    const fn = require(toTest.file);
    const inputPath = `fixtures/${toTest.fileName.replace('.js', '-cjs-input.js')}`;
    const outputPath = `fixtures/${toTest.fileName.replace('.js', '-cjs-output.js')}`;
    utils.diffFiles(fn, inputPath, outputPath);
  });
});
