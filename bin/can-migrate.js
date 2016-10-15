#!/usr/bin/env node
'use strict';

const path = require('path');
const meow = require('meow');
const inquirer = require('inquirer');
const execa = require('execa');
const globby = require('globby');
const series = require('promise-map-series');
const transforms = require('../');

const cli = meow(`
  Usage
  $ can-migrate [<file|glob> ...]

  Updates files accoroding to the CanJS 3.0 modern migration path
  More info: http://canjs.github.io/canjs/doc/migrate-3.html#Modernizedmigrationpath 

  Options
  --apply,  -a    Apply transforms (instead of a dry run)
  --minimal -m    Apply minimal transforms only
  --future  -f    Apply future-proof tranforms after modern tranforms
  --steal  -s     Project is using steal

  Examples
  can-migrate **/*.js
  can-migrate --apply **/*.js
  can-migrate -iad **/*.js
`, {
    boolean: ['apply', 'minimal', 'future', 'steal'],
    string: ['_'],
    alias: {
      a: 'apply',
      m: 'minimal',
      f: 'future',
      s: 'steal',
      h: 'help'
    }
  });

if (!cli.input.length) {
  cli.showHelp();
  return;
}

globby(cli.input).then((paths) => {
  let toApply = transforms.modern;
  if (cli.flags.minimal) {
    toApply = toApply.concat(transforms.minimal);
  }
  if (cli.flags.modern) {
    toApply = toApply.concat(transforms.minimal);
  }
  if (cli.flags.future) {
    toApply = toApply.concat(transforms.future);
  }

  return series(toApply, (transform) => {
    console.log(`${transform.name} running`);

    const jscodeshiftPath = path.resolve(__dirname, '../node_modules/.bin/jscodeshift')
    const args = ['-t', transform.file, cli.flags.apply ? '' : '-d', cli.flags.silent ? '-s' : ''].concat(paths);

    return execa(jscodeshiftPath, args, { stdio: 'inherit' }).then((result) => {
      if(!cli.flags.silent) {
        debugger
        console.log(`${result.stdout}\n`);
      }
    }).catch(console.error.bind(console));
  })
});
