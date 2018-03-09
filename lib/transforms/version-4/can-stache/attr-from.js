'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _canViewParser = require('can-view-parser');

var _canViewParser2 = _interopRequireDefault(_canViewParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalAttributes = ['xml:lang', 'xml:base', 'onabort', 'onautocomplete', 'onautocompleteerror', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragexit', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onshow', 'onsort', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting', 'accesskey', 'class', 'contenteditable', 'contextmenu', 'dir', 'draggable', 'hidden', 'id', 'is', 'lang', 'style', 'tabindex', 'title'];

var noop = function noop() {};

var isDataAttribute = function isDataAttribute(attributeName) {
  return attributeName.indexOf('data-') === 0;
};
var isAriaAttribute = function isAriaAttribute(attributeName) {
  return attributeName.indexOf('aria-') === 0;
};
var isBindingAttribute = function isBindingAttribute(attributeName) {
  return attributeName.startsWith('on:') || attributeName.endsWith(':to') || attributeName.endsWith(':from') || attributeName.endsWith(':bind');
};
var isInGlobalAttributes = function isInGlobalAttributes(attributeName) {
  return globalAttributes.indexOf(attributeName) >= 0;
};
var attributeShouldBeModified = function attributeShouldBeModified(attributeName) {
  return !isDataAttribute(attributeName) && !isAriaAttribute(attributeName) && !isBindingAttribute(attributeName) && !isInGlobalAttributes(attributeName);
};

var isCustomElement = function isCustomElement(tagName) {
  return tagName.includes('-');
};
var isCanElement = function isCanElement(tagName) {
  return tagName.indexOf('can-') === 0;
};
var tagShouldBeModified = function tagShouldBeModified(tagName) {
  return isCustomElement(tagName) && !isCanElement(tagName);
};

function transformer(file) {
  var src = file.source;
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'stache') {
    // this list contains a boolean for each attribute found during parsing to indicate
    // whether its value should be modified when looping through attributes with regex
    var parsedAttributes = [];

    var currentTag = '';

    // use parser to find all attributes and mark those that should be modified
    (0, _canViewParser2.default)(src, {
      start: function start(tagName) {
        currentTag = tagName;
      },
      end: function end() {
        currentTag = '';
      },
      attrStart: function attrStart(attrName) {
        parsedAttributes.push({
          name: attrName,
          boolean: true,
          shouldBeModified: false
        });
      },
      attrEnd: noop,
      attrValue: function attrValue() {
        var currentAttr = parsedAttributes[parsedAttributes.length - 1];

        currentAttr.shouldBeModified = tagShouldBeModified(currentTag) && attributeShouldBeModified(currentAttr.name);

        currentAttr.boolean = false;
      },
      done: noop,
      special: noop
    });

    // remove boolean attributes since the regex below will not find them
    parsedAttributes = parsedAttributes.filter(function (attr) {
      return !attr.boolean;
    });

    // use a regex to find attributes in source and modify them in place
    // if they were marked to be modified by the parsing step above
    var alphaNumeric = 'A-Za-z0-9';
    var alphaNumericHU = '-:_' + alphaNumeric;
    var attributeRegexp = new RegExp('[' + alphaNumericHU + ']+\s*=\s*("[^"]*"|\'[^\']*\')', 'gm');
    var attributes = src.match(attributeRegexp);

    for (var i = 0, parserIndex = 0; i < attributes.length; i++) {
      var attribute = attributes[i].slice(0, attributes[i].indexOf('='));
      var value = attributes[i].slice(attributes[i].indexOf('=') + 1);

      var parsedAttribute = parsedAttributes[parserIndex];
      // skip any attributes not found during parsing since they do not need to be modified
      if (parsedAttribute && parsedAttribute.name === attribute) {
        parserIndex++;

        if (parsedAttribute.shouldBeModified) {
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
  }

  return src;
}
module.exports = exports['default'];