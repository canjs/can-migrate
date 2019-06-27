#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const meow = require('meow');

const PATH = './src/templates';
const TRANSFORM_FILE = './build/transforms.json';

const cli = meow(`
  Usage
  $ can-migrate-generate [<path> <template> ...]

  Creates files for can-migrate

  Options
  --can-version     specify CanJS version

  Examples
  can-migrate-generate can-define-array define-array --can-version=6
  can-migrate-generate can-blob import --can-version=6
`, {
  string: ['can-version']
});
console.log('flags', cli.flags)
if (!cli.input.length || cli.input.length !== 2 || !cli.flags.canVersion) {
  cli.showHelp();
  return;
}

const migrationFolder = cli.input[0];
const migrationName = cli.input[1];

// check if the folder exists
if (!fs.existsSync(path.join(PATH, migrationFolder))) {
  // make the directory
  fs.mkdirSync(path.join(PATH, migrationFolder));
}

// Create each of these extensions
const extensions = [
  {
    ext: '.js',
    type: 'transform',
    template: (transform) => {
      return `import getConfig from '../../../utils/getConfig';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(\`can-migrate:${transform}:\${file.path}\`);
  const config = getConfig(options.config);
  const j = api.jscodeshift;

  return j(file.source)
    .toSource();
}
`
    }
  },
  {
    ext: '-input.js',
    type: 'fixture',
    template: () => ('')
  },
  {
    ext: '-output.js',
    type: 'fixture',
    template: () => ('')
  },
  {
    ext: '-test.js',
    type: 'test',
    template: (transform, version) => {
      return `require('mocha');
const utils = require('../../../../test/utils');
const transforms = require('../../../../');

const toTest = transforms.filter(function(transform) {
  return transform.name === '${transform}.js';
})[0];

describe('${transform}', function() {

  it('', function() {
    const fn = require(toTest.file);
    const inputPath = \`fixtures/version-${version}/\${toTest.fileName.replace('.js', '-input.js')}\`;
    const outputPath = \`fixtures/version-${version}/\${toTest.fileName.replace('.js', '-output.js')}\`;
    utils.diffFiles(fn, inputPath, outputPath);
  });

});
`;
    }
  }
];
const transforms = [];

for (let i = 0; i < extensions.length; i++) {
  const current = extensions[i];
  const file = `${migrationName}${current.ext}`;
  const migration = `${migrationFolder}/${migrationName}`;
  // Create a blank file
  fs.writeFileSync(path.join(PATH, migrationFolder, file), current.template(migration, cli.flags.canVersion));

  // Add to the transforms array
  transforms.push({
    input: `${migration}${current.ext}`,
    outputPath: `${migration}${current.ext}`,
    type: current.type,
    version: cli.flags.canVersion+''
  });
}

// Parse the existing transforms and push in this transform
const transformData = JSON.parse(fs.readFileSync(TRANSFORM_FILE));
transformData.push({
  copy: transforms
});

// Write out the new transforms file
fs.writeFileSync(TRANSFORM_FILE, JSON.stringify(transformData, null, 2));

console.log(`Successfully created files and transforms for: ${migrationName}`)
