# can-migrate

[![npm version](https://badge.fury.io/js/can-migrate.svg)](https://www.npmjs.com/package/can-migrate)
[![Build Status](https://travis-ci.org/canjs/can-migrate.svg?branch=master)](https://travis-ci.org/canjs/can-migrate)
[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/can-migrate.svg)](https://greenkeeper.io/)

CLI & codemod scripts for upgrading to CanJS 3 to 6.

## Usage

Check out the [Using Codemods guide on canjs.com](https://canjs.com/doc/guides/upgrade/using-codemods.html) for an overview of this project, how to install `can-migrate`, how to use the CLI, and recommendations for how to migrate your app.

## Generate template and tests

There is now a quick and easy way to create a transform and the associated tests and diff files. Running:
```
./bin/can-migrate-generate.js <folder> <transform> --can-version=6
```
Will either add the files to an existing folder or create a folder and add the files. It will create `transform.js` | `transform-test.js` | `transform-input.js` | `transform-output.js` as well as adding the information into the `transforms.json`.

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
