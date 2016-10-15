#!/usr/bin/env node
const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const beautify = require('js-beautify');
const transforms = require('./transforms.json');

const TEMPLATE_DIR = 'src/templates';
const DEST_DIR = 'src/transforms';
const PATH_RE = /\{([^\}]+)\}/g;

function getOutputPath(template, config) {
  return template.replace(PATH_RE, (matched, part) => {
    return config[part] || null;
  });
}

function generateTransform(transform) {
  transform.generate.forEach((g) => {
    const outputPath = getOutputPath(g.outputPath, transform);
    const templatePath = `${TEMPLATE_DIR}/${g.template}`;
    const destPath = `${DEST_DIR}/${transform.type}/${outputPath}`;
    ejs.renderFile(templatePath, transform, (err, str) => {
      if(err) {
        throw err;
      }
      fse.outputFile(destPath, str, (err) => {
        if (err) {
          throw err;
        }
        console.log(`>> Wrote: ${destPath}`);
      });
    });
  });
}

function generateTransforms(transforms) {
  transforms.forEach((transform) => {
    generateTransform(transform);
  });
}

fse.emptyDir(DEST_DIR, (err) => {
  if (err) {
    throw err;
  }
  console.log(`>> Emptied: ${DEST_DIR}`);
  generateTransforms(transforms);
});

