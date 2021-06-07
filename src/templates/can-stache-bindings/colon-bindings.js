var kebabToCamel = function (kebab) {
  return kebab.replace(/-(.)/g, function (x, $1) {
    return $1.toUpperCase();
  });
};

var transformStacheExplicit = function (src) {
  // older legacy binding.
  src = src.replace(/([-\w:]+)="\{([^}\n"]+)\}"/g, function (x, $1, $2) {
    return 'vm:' + kebabToCamel($1) + ':from="' + $2 + '"';
  });
  src = src.replace(/\bcan-(\w[-\w]+)=/g, function (x, $1) {
    if($1.toLowerCase() === 'value') {
      return 'el:' + kebabToCamel($1) + ':bind=';
    } else {
      return 'on:el:' + kebabToCamel($1) + '=';
    }
  });

  src = src.replace(/\{\^\$([^}\n]+)\}=/g, function (x, $1) {
    return 'el:' + kebabToCamel($1) + ':to=';
  });
  src = src.replace(/\{\^([^}\n]+)\}=/g, function (x, $1) {
    return 'vm:' + kebabToCamel($1) + ':to=';
  });

  src = src.replace(/\{\(\$([^)\n]+)\)\}=/g, function (x, $1) {
    return 'el:' + kebabToCamel($1) + ':bind=';
  });
  src = src.replace(/\{\(([^)\n]+)\)\}=/g, function (x, $1) {
    return 'vm:' + kebabToCamel($1) + ':bind=';
  });

  src = src.replace(/\{\$([^}\n]+)\}=/g, function (x, $1) {
    return 'el:' + kebabToCamel($1) + ':from=';
  });
  src = src.replace(/\{([^}\n]+)\}=/g, function (x, $1) {
    return 'vm:' + kebabToCamel($1) + ':from=';
  });

  src = src.replace(/\(\$([^)\n]+)\)=/g, function (x, $1) {
    return 'on:el:' + kebabToCamel($1) + '=';
  });
  src = src.replace(/\(([^)\n]+)\)=/g, function (x, $1) {
    return 'on:vm:' + kebabToCamel($1) + '=';
  });

  return src;
};

var transformStacheContextIntuitive = function (src) {
  // older legacy binding.
  src = src.replace(/([-\w:]+)="\{([^}\n"]+)\}"/g, function (x, $1, $2) {
    return kebabToCamel($1) + ':from="' + $2 + '"';
  });
  src = src.replace(/\bcan-(\w[-\w]+)=/g, function (x, $1) {
    if($1.toLowerCase() === 'value') {
      return kebabToCamel($1) + ':bind=';
    } else {
      return 'on:' + kebabToCamel($1) + '=';
    }
  });

  src = src.replace(/\{\^\$?([^}\n]+)\}=/g, function (x, $1) {
    return kebabToCamel($1) + ':to=';
  });
  src = src.replace(/\{\(\$?([^)\n]+)\)\}=/g, function (x, $1) {
    return kebabToCamel($1) + ':bind=';
  });
  src = src.replace(/\{\$?([^}\n]+)\}=/g, function (x, $1) {
    return kebabToCamel($1) + ':from=';
  });
  src = src.replace(/\(\$?([^)\n]+)\)=/g, function (x, $1) {
    return 'on:' + kebabToCamel($1) + '=';
  });

  return src;
};

var transformStache = function (src, useImplicitBindings) {
  return useImplicitBindings ?
    transformStacheContextIntuitive(src) :
    transformStacheExplicit(src);
};

var transformJs = function (src, useImplicitBindings) {
  //find call to stache with a template passed in
  //note: only catches the call if a string is passed in and maynot work well if it's not one full string
  return src.replace(/(\bstache\(\s*(['"`]))((?:[^\\\2]|\\[\s\S])*?)(\2\s*\))/g, function (fullStr, $1, quoteType, $3, $4) {
    return $1 + transformStache($3, useImplicitBindings) + $4;
  });
};

var transformHtml = function (src, useImplicitBindings) {
  //find script tag with type text/stache
  return src.replace(/(<script[^>]*type=("|')text\/stache\2[^>]*>)([\s\S]+?)(<\/script>)/g, function (fullStr, $1, quoteType, $3, $4) {
    return $1 + transformStache($3, useImplicitBindings) + $4;
  })
  // find steal.js script tag
  .replace(/(<script[^>]*src=("|').*steal\/steal\.js\2[^>]*>)([\s\S]+?)(<\/script>)/g, function (fullStr, $1, quoteType, $3, $4) {
    return $1 + transformJs($3, useImplicitBindings) + $4;
  });
};

var transformMd = function (src, useImplicitBindings) {
  //find ```html code blocks and treat it as stache
  //find ```js code blocks and treat them as js
  return src.replace(/(```)(js|javascript|html)?((?:[\s\S])+?)\1/g, function (fullStr, ticks, codeBlockType, codeBlock) {
    codeBlockType = codeBlockType || '';
    var output = ticks + codeBlockType;

    if (codeBlockType === 'html') {
      output += transformStache(codeBlock, useImplicitBindings);
    } else if (codeBlockType === 'js' || codeBlockType === 'javascript' ) {
      output += transformJs(codeBlock, useImplicitBindings);
    } else {
      output += codeBlock;
    }
    return output + ticks;
  });
};

var transformComponent = function (src, useImplicitBindings) {
  //find <template> or <view> tags and treat them as stache
  return src.replace(/(<template>|<view>)([\s\S]+?)(<\/template>|<\/view>)/g, function (fullStr, $1, $2, $3) {
    return $1 + transformStache($2, useImplicitBindings) + $3;
  })
  //find <view-model> or <script type="view-model"> tags and treat them as js
  .replace(/(<view-model>|<script[^>]*type=("|')view-model\2[^>]*>)([\s\S]+?)(<\/view-model>|<\/script>)/g, function (fullStr, $1, quoteType, $3, $4) {
    return $1 + transformJs($3, useImplicitBindings) + $4;
  });
};

export default function transformer(file, api, options) {
  var src = file.source;
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);
  var useImplicitBindings = options.implicit;

  if (type === 'js') {
    src = transformJs(src, useImplicitBindings);
  } else if (type === 'md') {
    src = transformMd(src, useImplicitBindings);
  } else if (type === 'html') {
    src = transformHtml(src, useImplicitBindings);
  } else if (type === 'stache') {
    src = transformStache(src, useImplicitBindings);
  } else if (type === 'component') {
    src = transformComponent(src, useImplicitBindings);
  }

  return src;
}
