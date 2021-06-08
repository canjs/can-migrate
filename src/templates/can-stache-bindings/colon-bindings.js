var kebabToCamel = function (kebab) {
  return kebab.replace(/-(.)/g, function (x, $1) {
    return $1.toUpperCase();
  });
};

var cvTypeRE = /\btype=\\?"([^"]*?)\\?"/;
var cvValueRE = /[^-]\bvalue=\\?"([^"]*?)\\?"/;
var cvCanValueRE = /\bcan-value=\\?"([^"]*?)(\\?")/;
var cvTrueValueRE = /\bcan-true-value=\\?"([^"]*?)\\?"/;
var cvFalseValueRE = /\bcan-false-value=\\?"([^"]*?)\\?"/;
var cvTagCloseRE = / ?\/?>/;

function makeCanValueProcessor(explicit, escapeSingleQuote) {
  return function ($0) {
    var type = (cvTypeRE.exec($0) || [])[1];
    var valueBindingAndQuote = (cvCanValueRE.exec($0) || []);
    var valueBinding = valueBindingAndQuote[1];
    var valueText = (cvValueRE.exec($0) || [])[1];
    var trueValue = (cvTrueValueRE.exec($0) || [])[1] || '';
    var falseValue = (cvFalseValueRE.exec($0) || [])[1] || '';
    var tagEnd = (cvTagCloseRE.exec($0) || ['>'])[0];

    var q = valueBindingAndQuote[2] || '"';
    var sq = escapeSingleQuote && q === '"' ? '\\\'' : '\'';

    var canValueExp;
    switch(type) {
      case 'checkbox':
        if(trueValue || falseValue) {
          canValueExp = (explicit ? 'el:' : '') + 'checked:bind=' + q + 'either-or(' + valueBinding + ', ' + sq + trueValue + sq + ', ' + sq + falseValue + sq + ')' + q;
        } else {
          canValueExp = (explicit ? 'el:' : '') + 'checked:bind=' + q + valueBinding + q;
        }
      break;
      case 'radio':
        if(valueText) {
          canValueExp = (explicit ? 'el:' : '') + 'checked:bind=' + q + 'equal(' + valueBinding + ', ' + sq + valueText + sq + ')' + q;
        } else {
          canValueExp = (explicit ? 'el:' : '') + 'checked:bind=' + q + valueBinding + q;
        }
      break;
      default:  // text, select, textarea, number, password, etc.
        canValueExp = (explicit ? 'el:' : '') + 'value:bind=' + q + valueBinding + q;
      break;
    }

    return $0.replace(cvCanValueRE, '')
      .replace(cvTrueValueRE, '')
      .replace(cvFalseValueRE, '')
      .replace(cvTagCloseRE, '')
      .replace(/([^\n ]) +/g, '$1 ')
      .trim() +
        ' ' +
        canValueExp +
        tagEnd;
  };
}


var transformStacheExplicit = function (src, escapeSingleQuote) {
  // older legacy binding.
  src = src.replace(/<[^>]*\bcan-value=[^>]*>/g, makeCanValueProcessor(true, escapeSingleQuote));
  src = src.replace(/\bcan-(\w[-:\w]+)=/g, function (x, $1) {
    return 'on:el:' + kebabToCamel($1) + '=';
  });
  src = src.replace(/([-\w:]+)=(\\?")\{(?!\{)([^}\n"]+)\}\\?"/g, function (x, $1, $quot, $2) {
    if(/^on:|:bind$/.test($1)) {
      return $1 + '=' + $quot + $2 + $quot;
    } else {
      return 'vm:' + kebabToCamel($1) + ':from=' + $quot + $2 + $quot;
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

var transformStacheContextIntuitive = function (src, escapeSingleQuote) {
  // older legacy binding.
  // can-value is the trickiest because the new binding is different
  //   for different input types.  In addition, checkboxes can have
  //   can-true-value and can-false-value, which need to combine with
  //   can-value's value to produce an either-or stache converter in later Can.
  src = src.replace(/<[^>]*\bcan-value=[^>]*>/g, makeCanValueProcessor(false, escapeSingleQuote));
  src = src.replace(/\bcan-(\w[-:\w]+)=/g, function (x, $1) {
    return 'on:' + kebabToCamel($1) + '=';
  });
  src = src.replace(/([-\w:]+)=(\\?")\{(?!\{)([^}\n"]+)\}\\?"/g, function (x, $1, $quot, $2) {
    if(/^on:|:bind$/.test($1)) {
      return $1 + '=' + $quot + $2 + $quot;
    } else {
      return kebabToCamel($1) + ':from=' + $quot + $2 + $quot;
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

var transformStache = function (src, useImplicitBindings, escapeSingleQuote) {
  return useImplicitBindings ?
    transformStacheContextIntuitive(src, escapeSingleQuote) :
    transformStacheExplicit(src, escapeSingleQuote);
};

var transformJs = function (src, useImplicitBindings) {
  //find call to stache with a template passed in
  //note: only catches the call if a string is passed in and maynot work well if it's not one full string
  return src.replace(/(\bstache\(\s*(['"`]))((?:[^\\\2]|\\[\s\S])*?)(\2\s*\))/g, function (fullStr, $1, quoteType, $3, $4) {
    return $1 + transformStache($3, useImplicitBindings, true) + $4;
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
