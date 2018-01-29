#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const deepAssign = require('deep-assign');
const config = require('../config.json');
const transforms = require('./transforms.json');

const DIRS = {
  test: 'src/transforms',
  transform: 'src/transforms',
  fixture: 'test/fixtures'
};
const TEMPLATE_DIR = 'src/templates';
const PATH_RE = /\{([^\}]+)\}/g;
const testFiles = [];

function sub(template, config) {
  return template.replace(PATH_RE, (matched, part) => {
    return config[part] || null;
  });
}

function copyTemplate(copy) {
  const versionDir = 'version-' + copy.version
  const outputPath = `../${copy.type ? DIRS[copy.type] + '/' : ''}${versionDir +'/'}${copy.outputPath}`;
  const srcPath = `../${TEMPLATE_DIR}/${copy.input}`;
  if(copy.type === "test") {
    testFiles.push(`${outputPath.replace('src/', 'lib/')}`);
  }
  fs.copy(path.join(__dirname, srcPath), path.join(__dirname, outputPath), (err) => {
    if (err) {
      throw err;
    }
    console.log(`>> Copied: ${outputPath}`);
  });
}

function writeTemplate(generate, transform) {
  const versionDir = 'version-' + generate.version
  const outputPath = `${generate.type ? DIRS[generate.type] + '/' : ''}${generate.type ? versionDir +'/' : ''}${sub(generate.outputPath, transform)}`;
  const templatePath = `${TEMPLATE_DIR}/${generate.template}`;
  if(generate.type === "test") {
    testFiles.push(`../${outputPath.replace('src/', 'lib/')}`);
  }
  ejs.renderFile(templatePath, transform, (err, str) => {
    if(err) {
      throw err;
    }
    fs.outputFile(outputPath, str, (err) => {
      if (err) {
        throw err;
      }
      console.log(`>> Wrote: ${outputPath}`);
    });
  });
}

function writeTransform(transform) {
  if(transform.generate) {
    transform.generate.forEach((g) => {
      transform.transforms.forEach((t) => {
        const data = deepAssign({}, t, config);
        writeTemplate(g, data);
      });
    });
  }
  if(transform.copy) {
    transform.copy.forEach((c) => {
      copyTemplate(c);
    });
  }
}

function writeTransforms(transforms) {
  transforms.forEach((transform) => {
    writeTransform(transform);
  });
  writeTemplate({
    outputPath: 'test/test.js',
    template: 'test.ejs',
  }, {
    tests: testFiles
  });
}

fs.emptyDir(DIRS.transform, (err) => {
  if (err) {
    throw err;
  }
  console.log(`>> Emptied: ${DIRS.transform}`);
  fs.emptyDir(DIRS.fixture, (err) => {
    if (err) {
      throw err;
    }
    console.log(`>> Emptied: ${DIRS.fixture}`);
    writeTransforms(transforms);
  });
});

