'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var globalAttributes = ['xml:lang', 'xml:base', 'onabort', 'onautocomplete', 'onautocompleteerror', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragexit', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onshow', 'onsort', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting', 'accesskey', 'class', 'contenteditable', 'contextmenu', 'dir', 'draggable', 'hidden', 'id', 'is', 'lang', 'style', 'tabindex', 'title'];

function transformer(file) {
  var src = file.source;
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'stache') {
    var alphaNumeric = 'A-Za-z0-9';
    var alphaNumericHU = '-:_' + alphaNumeric;
    var attributeRegexp = new RegExp("[" + alphaNumericHU + "]+\s*=\s*(\"[^\"]*\"|'[^']*')", 'gm'); // jshint ignore:line
    var attributes = src.match(attributeRegexp);
    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i].slice(0, attributes[i].lastIndexOf('='));
      var value = attributes[i].slice(attributes[i].lastIndexOf('=') + 1);
      if (globalAttributes.indexOf(attribute) === -1 && !attribute.includes('aria') && !attribute.includes('data')) {
        src = src.replace(attribute, attribute + ':from');
        if (value.includes("'")) {
          // jshint ignore:line
          src = src.replace(value, '"' + value + '"'); // jshint ignore:line
        } else {
          src = src.replace(value, "'" + value + "'"); // jshint ignore:line
        }
      }
    }
  }

  return src;
}
module.exports = exports['default'];