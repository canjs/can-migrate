Transforms


## Transform Forms

All transforms are store in `build/transforms.json`.

```js
[
  {
    // The migration path the transform belongs to
    "type": `minimal`, `modern` or `future`
    // List of files to copy
    "copy": {
      // file to copy
      "template",
      // destination
      "outputPath",
      // type of file (affects the final destination)
      "type": `transform`, `fixture` or `test`
    },
    // List of files to generate using ejs
    "generate": {
      // ejs template
      "template",
      // destination
      "outputPath",
      // type of file (affects the final destination)
      "type": `transform`, `fixture` or `test`
    },
    // config for generated transforms
    
    "transforms": [
      { 
        // Any properties used here are available inside the ejs template
      }
    ]
  }
];
```
