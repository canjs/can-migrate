'use strict';

const fs  = require('fs');
const path = require('path');

const MINIMAL_PATH = '/lib/transforms/minimal';
const MODERN_PATH = '/lib/transforms/modern';
const FUTURE_PATH = '/lib/transforms/future';

// const minimalDirs = fs.readdirSync(path.join(__dirname, MINIMAL_PATH));
const modernDirs = fs.readdirSync(path.join(__dirname, MODERN_PATH));
// const futureDirs = fs.readdirSync(path.join(__dirname, FUTURE_PATH));
let minimal = [];
let modern = [];
let future = [];

// minimal = minimalDirs.map((dir) => {
//   const transforms = fs.readdirSync(path.join(__dirname, `${MODERN_PATH}/${dir}`));
//   return transforms.map((transformFile) => {
//    return {
//       name: `${dir}/${transformFile}`,
//       file: path.join(__dirname, `${MODERN_PATH}/${dir}/${transformFile}`)
//     };
//   });
// });
modernDirs.forEach((dir) => {
  const transforms = fs.readdirSync(path.join(__dirname, `${MODERN_PATH}/${dir}`));
  transforms.forEach((transformFile) => {
   modern.push({
      name: `${dir}/${transformFile}`,
      fileName: `${dir}/${transformFile}`,
      file: path.join(__dirname, `${MODERN_PATH}/${dir}/${transformFile}`)
   });
  });
});

// future = futureDirs.map((dir) => {
//   const transforms = fs.readdirSync(path.join(__dirname, `${MODERN_PATH}/${dir}`));
//   return transforms.map((transformFile) => {
//    return {
//       name: `${dir}/${transformFile}`,
//       file: path.join(__dirname, `${MODERN_PATH}/${dir}/${transformFile}`)
//     };
//   });
// });

exports.minimal = minimal;
exports.modern = modern;
exports.future = future;
