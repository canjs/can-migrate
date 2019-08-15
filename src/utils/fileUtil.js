import j from 'jscodeshift';

/**
 * Util for running transforms against different sources
 * This should run the transforms against
 * .md
 * .html
 * .js
 */
export default function fileTransform (file, transformer) {
  const src = file.source;
  const path = file.path;
  const type = path.slice(path.lastIndexOf('.') + 1);

  const safeTransform = function (source) {
    try {
      // Verify the source is valid
      j(source);
      // run the transformer function
      return transformer(source);
    } catch (error) {
      console.log(`File source invalid: ${path}
Error: ${error.message}.`);
      // Return the source
      return source;
    }
  };

  switch (type) {
    case 'md':
      return transformMd(src, safeTransform);
    case 'js':
      return safeTransform(src);
    case 'mjs':
      return safeTransform(src);
    case 'html':
      return transformHtml(src, safeTransform);
  }

  return src;
}

function transformHtml (src, transformer) {
  // find just a script tag
  return src.replace(/(<script[^>]*type=("|')module\2[^>]*>|<script>)([\s\S]+?)(<\/script>)/g, function (fullStr, $1, $quoteType, $3, $4) {
    return $1 + transformer($3) + $4;
  })
  // find steal.js script tag
  .replace(/(<script[^>]*src=("|').*steal\/steal\.js\2[^>]*>)([\s\S]+?)(<\/script>)/g, function (fullStr, $1, quoteType, $3, $4) {
    return $1 + transformer($3) + $4;
  });
}

function transformMd (src, transformer) {
  // find ```html code blocks and treat it as stache
  // find ```js code blocks and treat them as js
  return src.replace(/(```)(js|javascript|html)((?:[\s\S])+?)\1/g, function (fullStr, ticks, codeBlockType, codeBlock) {
    codeBlockType = codeBlockType || '';
    var output = ticks + codeBlockType;
    let transformedCode;
    let space = fullStr.match(/\s+(?=```)/);
    space = space[0].replace('\n', '');

    if (codeBlockType === 'html') {
      transformedCode = transformHtml(codeBlock, transformer);
    } else {
      transformedCode = transformer(codeBlock);
    }

    // Ensure we have newlines at the start and end
    // When replacing the Component.extend with the class it removes all newlines
    // ```js\n
    // codeBlock \n
    // ```
    if (!/^\n|\n$/g.test(transformedCode)) {
      transformedCode = `\n${transformedCode}\n`;
    }

    return `${output}${transformedCode}${ticks}`;
  });
}
