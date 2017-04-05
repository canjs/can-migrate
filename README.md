# can-migrate-codemods

Codemods for migrating to CanJS 3.0

## transforms.json

This file has become quite convoluted and warrants some refactor. Here's how it is currently organized:

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
    "type": "modern" // Possibly remove (only do modern migration)
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
