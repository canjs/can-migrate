#!/usr/bin/env node
'use strict';

const path = require('path');
const meow = require('meow');
const execa = require('execa');
const globby = require('globby');
const series = require('promise-map-series');
const isGitClean = require('is-git-clean');
const transforms = require('../');

const ENSURE_BACKUP_MESSAGE = 'Ensure you have a backup of your tests or commit the latest changes before continuing.';

function checkGitStatus(force) {
  let clean = false;
  let errorMessage = 'Unable to determine if git directory is clean';

  try {
    clean = isGitClean.sync(process.cwd(), { files: ['!package.json'] });
		errorMessage = 'Git directory is not clean';
  } catch (e) { }
  if (!clean) {
    if (force) {
      console.log(`WARNING: ${errorMessage}.\nForcibly continuing.\n${ENSURE_BACKUP_MESSAGE}`);
    } else {
      console.log(`ERROR: ${errorMessage}. Refusing to continue.\n${ENSURE_BACKUP_MESSAGE}\nYou may use the --force flag to override this safety check.`);
      return false;
    }
  }
  return true;
}

const cli = meow(`
  Usage
  $ can-migrate [<file|glob> ...]

  Updates files according to the CanJS 3.0 migration paths (minimal, modern, future)
  More info: http://canjs.github.io/canjs/doc/migrate-3.html#Modernizedmigrationpath 

  Options
  --apply     -a    Apply transforms (instead of a dry run)
  --minimal   -m    Apply minimal transforms only
  --future    -f    Apply future-proof tranforms after modern tranforms
  --force          Apply transforms regardless of git status 
  --replace   -r    Replace name of imports and requires
  --config    -c    Path to custom config file
  --transform -t    specify a transform

  Examples
  can-migrate **/*.js
  can-migrate --apply **/*.js
  can-migrate -iad **/*.js
`, {
    boolean: ['apply', 'minimal', 'future', 'steal', 'replace', 'force'],
    string: ['_', 'config', 'transform'],
    alias: {
      a: 'apply',
      m: 'minimal',
      f: 'future',
      r: 'replace',
      c: 'config',
      h: 'help'
    }
  });

if (!cli.input.length) {
  cli.showHelp();
  return;
}

if(!checkGitStatus(cli.flags.force)) {
  process.exit(1);
}

globby(cli.input).then((paths) => {
  let toApply = transforms.modern;
  let config;
  if (cli.flags.minimal) {
    toApply = transforms.minimal;
  }
  if (cli.flags.future) {
    toApply = toApply.concat(transforms.future);
  }
  if (cli.flags.transform) {
    toApply = toApply.filter((t) => {
      return t.name.indexOf(cli.flags.transform) !== -1;
    });
  }
  if (cli.flags.config) {
    config = path.resolve(__dirname, cli.flags.config);
  }

  return series(toApply, (transform) => {
    console.log(`${transform.name} running`);

    const jscodeshiftPath = path.resolve(__dirname, '../node_modules/.bin/jscodeshift');
    const args = [
      '-t', transform.file,
      cli.flags.apply ? '' : '-d',
      cli.flags.silent ? '-s' : '',
      cli.flags.config ? `--config=${config}` : '',
      cli.flags.replace ? `--replace` : ''
    ].concat(paths);

    return execa(jscodeshiftPath, args, { stdio: 'inherit' }).then(() => {
      //
    }).catch(console.error.bind(console));
  });
});
