@module {function} can-migrate-codemods
@parent can-ecosystem
@package ../package.json

@description A CLI tool to migrate CanJS codebases from 2.x to 3.x

@signature `can-migrate-codements( filepath, transform )`

`can-migrate-codemods` is large-scale codebase refactoring tool that is partially automated but still requires oversight and intervention. A codemod is a transformation script that parses the [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) of source code in order to do a code-aware find-and-replace refactor across multiple files. This module contains a CLI with various codemods that transform Can.js 2.x to 3.x. It is intended to help you get started with a Can.js migration from 2.x to 3.x. However, it won't be a complete solution for a seamless migration, but it will get you significantly closer than doing it by hand. Custom codemod transformations can also be used with the can-migrate CLI. 

@param {JavaScript Files} glob A glob that matches JavaScript files containing CanJS 2.x code to be migrated.

@param {Transform File} glob A glob that matches a file that contains a codemod transform script.

@options {flags} string The CLI recognizes the following options 

  --apply     -a    Apply transforms (instead of a dry run)
  --force           Apply transforms regardless of git status
  --silent    -s    Silence output
  --config    -c    Path to custom config file
  --transform -t    specify a transform


@return {JavaScript Files} Files will be written in the CanJS 3.x style.

@body

## Use

Runs all the default can-migrate transforms on the files that match the **/*.js glob

```
$ can-migrate --apply **/*.js
```

Runs the `can-component-rename` transform on the files that match the **/*.js glob

```
$ can-migrate can-migrate **/*.js --transforms can-component-rename/can-component-rename.js --apply 
```


The CLI provides the following options:
```
$ can-migrate [<file|glob> ...]

  Updates files according to the CanJS 3.0 migration paths (minimal, modern, future)

  Options
  --apply     -a    Apply transforms (instead of a dry run)
  --force           Apply transforms regardless of git status
  --silent    -s    Silence output
  --config    -c    Path to custom config file
  --transform -t    specify a transform

## Recommended Migration Process

1. Make a new branch for the migration.
    ```shell
    $ git checkout -b migration
    ``` 
1. Ensure all tests are passing and your git state is clean.
  As with any migration, if your code is not tested, the amount of time it takes for a successful migration is exponentially greater.
1. Run the transforms on each [modlet](https://www.bitovi.com/blog/modlet-workflows) or standalone testable component.
    ```shell
    $ can-migrate [<modlet/*.js>] --apply
    ```
    Alternatively, you can run one transform at a time for a more incremental approach:
    ```shell
    $ can-migrate [<modlet/*.js>] --transforms <transform path> --apply 
    ```
1. Install the [can-* modules](https://canjs.com/doc/api.html#ThecanPackage) used in that modlet or component. Here are some common ones:
    ```shell
    $ npm i can-component --save
    $ npm i can-compute --save
    $ npm i can-connect --save
    $ npm i can-define --save
    $ npm i can-route --save
    $ npm i can-route-pushstate --save
    $ npm i can-set --save
    $ npm i can-stache --save
    $ npm i can-stache-bindings --save
    ```

1. Run the tests again, and fix the bugs as they come up.
  Review the [migration guide](https://canjs.com/doc/migrate-3.html) to understand what changes to expect
1. Commit the module once all tests are passing again.
1. Repeat 2-6 until all modlet or components are migrated and tests are passing.

Note: If you are using steal, ensure you are running on Steal 0.16 or greater.



