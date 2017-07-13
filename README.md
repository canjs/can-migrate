# can-migrate-codemods

[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/can-migrate-codemods.svg)](https://greenkeeper.io/)

Codemods for migrating to CanJS 3.0

## Overview

`can-migrate-codemods` is a codebase refactoring tool that is partially automated but still requires oversight and intervention. A codemod is a transformation script that parses the [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) of source code in order to do a code-aware find-and-replace refactor across multiple files. This module contains a CLI with various codemods that transform Can.js 2.x to 3.x. It is intended to help you get started with a Can.js migration from 2.x to 3.x. However, it won't be a complete solution for a seamless migration, but it will get you significantly closer than doing it by hand. Custom codemod transformations can also be used with the can-migrate CLI. 

### What has changed in CanJS 3?

The short version, the core modules have not changed that much however there are a handful of useful new features and a more modular project structure.

For the long version, read more about it [in the migration guide](https://canjs.com/doc/migrate-3.html)

## Install

Install can-migrate from npm:
  ```shell
  $ npm install -g can-migrate-codemods
  ```
This will make the `can-migrate` command available.

## Usage(CLI)

The CLI provides the following options:
```
$ can-migrate [<files> OPTIONS...]

  Updates files according to the CanJS 3.0 migration paths (minimal, modern, future)

  Options
  --apply     -a    Apply transforms (instead of a dry run)
  --force           Apply transforms regardless of git status
  --silent    -s    Silence output
  --config    -c    Path to custom config file
  --transform -t    specify a transform

```

** Example usage**

Runs all the default can-migrate transforms on the files that match the **/*.js glob

```
$ can-migrate --apply **/*.js
```

Runs the `can-component-rename` transform on the files that match the **/*.js glob

```
$ can-migrate can-migrate **/*.js --transforms can-component-rename/can-component-rename.js --apply 
```

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


## transforms.json

There is one entry in the array per type of template/test required to generate the transforms. 
The current groups of transforms are:

- Component Rename: rename parts of a component
- can.extend: swap out extend for assign or deep-assign
- can-data: swap out .data() for domData
- Replace imports/requires: Replace existing import/require statements and replace any references in the code
- Replace can.*: Replace can.* methods and add the corresponding import/require


```
[
  {
    "copy": [ // Copy these files from src
      {
        "input": "...", // Source filename
        "output: "...", // Destination filename
        "type": "fixture|test|transform" // Type of copy determines where the destination file ends up (more on that below)
      }
    ],
    "generate": [ // Generate output from the template in src using "transforms
      {
        "template": "...", // Source filename
        "outputPath: "...", // Destination filename
        "type": "fixture|test|transform" // Type of copy determines where the destination file ends up (more on that below)
      }
    ],
    "transforms": [
      {
        "shortName": "component", // Short name of the transform for debugging and template filename generation
        "oldSourceValues": [ // List of ways this component could be imported/required. Used to replace these with newer component import
          "can/component/",
          "can/component/component",
          "can/component/component.js"
        ],
        "newSourceValue": "can-component", // The new value of the import/require
        "exampleLocalName": "MyComponent" // The example local name to include in generate documentation
        "oldObjectName": "can", // Object name to look for
        "oldPropertyName": "addEvent", // Property name to look for
        "newPropertyName": addEventListener, // What should replace the object.property (false for nothing, could be a complex replacement like mutate.appendChild)
        "sourceValue": "can-construct" // Key to look up the configurable naming in config.json
      }
    ]
  }
]
```

## Types

- __test__: Copied to `lib`, file is added to `test/test.js`.
- __fixture__ : Copied to `test/fixtures`
- __transform__: Copied to `lib/transforms`
