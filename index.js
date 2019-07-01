'use strict';

const fs  = require('fs');
const path = require('path');
const transforms = require('./build/transforms.json');

const TRANSFORM_PATH = '/lib/transforms';

const transformVersionDirs = fs.readdirSync(path.join(__dirname, TRANSFORM_PATH));
let transformFiles = [];

// We are going to add the order from the transforms.json file
// First let's create a map based on the file name
const transformsOrdered = transforms.reduce((acc, current) => {
  // Only get the order for copy's
  if (current.copy) {
    current.copy.forEach(prop => {
      if (prop.type === 'transform' && prop.order) {
        acc[prop.outputPath] = prop.order;
      }
    });
  }

  return acc;
}, {});

function getTransforms(versionDir) {
  const dirPath = path.join(__dirname, `${TRANSFORM_PATH}/${versionDir}`);
  if(fs.lstatSync(dirPath).isDirectory()) {
    const transformDirs = fs.readdirSync(dirPath);
    transformDirs.forEach((transformDir) => {
      const innerDirPath = path.join(__dirname, `${TRANSFORM_PATH}/${versionDir}/${transformDir}`);
      const transforms = fs.readdirSync(innerDirPath);
      transforms.forEach((transformFile) => {
        if(transformFile.indexOf('-test.js') === -1) {
          const version = versionDir.charAt(versionDir.length - 1);
          const transform = {
            name: `${transformDir}/${transformFile}`,
            fileName: `${transformDir}/${transformFile}`,
            file: path.join(__dirname, `${TRANSFORM_PATH}/${versionDir}/${transformDir}/${transformFile}`),
            version
          };

          // If this 
          if (transformsOrdered[transform.fileName]) {
            transform.order = transformsOrdered[transform.fileName];
          }

          transformFiles.push(transform);
        }
      });
    });
  }
}

transformVersionDirs.forEach((dir) => {getTransforms(dir)});

module.exports = transformFiles;
