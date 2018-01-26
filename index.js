'use strict';

const fs  = require('fs');
const path = require('path');

const TRANSFORM_PATH = '/lib/transforms';

const transformVersionDirs = fs.readdirSync(path.join(__dirname, TRANSFORM_PATH));
let transformFiles = [];

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
          transformFiles.push({
            name: `${transformDir}/${transformFile}`,
            fileName: `${transformDir}/${transformFile}`,
            file: path.join(__dirname, `${TRANSFORM_PATH}/${versionDir}/${transformDir}/${transformFile}`),
            version
          });
        }
      });
    });
  }
}

transformVersionDirs.forEach((dir) => {getTransforms(dir)});

module.exports = transformFiles;
