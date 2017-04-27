'use strict';

const fs  = require('fs');
const path = require('path');

const TRANSFORM_PATH = '/lib/transforms';

const transformDirs = fs.readdirSync(path.join(__dirname, TRANSFORM_PATH));
let transformFiles = [];

transformDirs.forEach((dir) => {
  const dirPath = path.join(__dirname, `${TRANSFORM_PATH}/${dir}`);
  if(fs.lstatSync(dirPath).isDirectory()) {
    const transforms = fs.readdirSync(dirPath);
    transforms.forEach((transformFile) => {
      if(transformFile.indexOf('-test.js') === -1) {
        transformFiles.push({
          name: `${dir}/${transformFile}`,
          fileName: `${dir}/${transformFile}`,
          file: path.join(__dirname, `${TRANSFORM_PATH}/${dir}/${transformFile}`)
        });
      }
    });
  }
});

module.exports = transformFiles;
