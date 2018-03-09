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
    var attributeAtIndexShouldBeModified = [];

    var currentTag = '';

    (0, _canViewParser2.default)(src, {
      start: function start(tagName) {
        currentTag = tagName;
      },
      end: function end() {
        currentTag = '';
      },
      attrStart: function attrStart(attrName) {
        var shouldModify = tagShouldBeModified(currentTag) && attributeShouldBeModified(attrName);
        attributeAtIndexShouldBeModified.push(shouldModify);
      },
      attrEnd: noop,
      attrValue: noop,
      done: noop,
      special: noop
    });

    var alphaNumeric = 'A-Za-z0-9';
    var alphaNumericHU = '-:_' + alphaNumeric;
    var attributeRegexp = new RegExp('[' + alphaNumericHU + ']+\s*=\s*("[^"]*"|\'[^\']*\')', 'gm');
    var attributes = src.match(attributeRegexp);

    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i].slice(0, attributes[i].lastIndexOf('='));
      var value = attributes[i].slice(attributes[i].lastIndexOf('=') + 1);
      if (attributeAtIndexShouldBeModified[i]) {
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