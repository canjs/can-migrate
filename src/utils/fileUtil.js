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

  switch (type) {
    case 'md':
      return transformMd(src, transformer);
    case 'js':
      return transformer(src);
    case 'html':
      return transformHtml(src, transformer);
  }

  return src;
}

function transformHtml (src, transformer) {
  // find script tag with type text/stache
  return src.replace(/(<script[^>]*type=("|')text\/stache\2[^>]*>)([\s\S]+?)(<\/script>)/g, function (fullStr, $1, quoteType, $3, $4) {
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
  return src.replace(/(```)(js|javascript|html)?((?:[\s\S])+?)\1/g, function (fullStr, ticks, codeBlockType, codeBlock) {
    codeBlockType = codeBlockType || '';
    var output = ticks + codeBlockType;

    let transformedCode = transformer(codeBlock);

    // Ensure we have newlines at the start and end
    // ```js\n
    // codeBlock \n
    // ```
    if (!/^\n|\n$/g.test(transformedCode)) {
      transformedCode = `\n${transformedCode}\n`;
    }

    return output + transformedCode + ticks;
  });
}
