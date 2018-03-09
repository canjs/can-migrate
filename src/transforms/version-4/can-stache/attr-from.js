import parser from 'can-view-parser';

const globalAttributes = ['xml:lang', 'xml:base', 'onabort', 'onautocomplete',
  'onautocompleteerror', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough',
  'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick',
  'ondrag', 'ondragend', 'ondragenter', 'ondragexit', 'ondragleave', 'ondragover',
  'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror',
  'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup',
  'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown',
  'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover',
  'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress',
  'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking',
  'onselect', 'onshow', 'onsort', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate',
  'ontoggle', 'onvolumechange', 'onwaiting', 'accesskey', 'class', 'contenteditable',
  'contextmenu', 'dir', 'draggable', 'hidden', 'id', 'is', 'lang', 'style',
  'tabindex', 'title'];

const noop = function() {};

const isDataAttribute = (attributeName) => attributeName.indexOf('data-') === 0;
const isAriaAttribute = (attributeName) => attributeName.indexOf('aria-') === 0;
const isBindingAttribute = (attributeName) =>
  attributeName.startsWith('on:') ||
  attributeName.endsWith(':to') ||
  attributeName.endsWith(':from') ||
  attributeName.endsWith(':bind');
const isInGlobalAttributes = (attributeName) => globalAttributes.indexOf(attributeName) >= 0;
const attributeShouldBeModified = (attributeName) =>
  !isDataAttribute(attributeName) &&
  !isAriaAttribute(attributeName) &&
  !isBindingAttribute(attributeName) &&
  !isInGlobalAttributes(attributeName);

const isCustomElement = (tagName) => tagName.includes('-');
const isCanElement = (tagName) => tagName.indexOf('can-') === 0;
const tagShouldBeModified = (tagName) =>
  isCustomElement(tagName) &&
  !isCanElement(tagName);

export default function transformer(file) {
  let src = file.source;
  const path = file.path;
  const type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'stache') {
    // this list contains a boolean for each attribute found during parsing to indicate
    // whether its value should be modified when looping through attributes with regex
    let attributeAtIndexShouldBeModified = [];

    let currentTag = '';

    parser(src, {
      start: function(tagName) {
        currentTag = tagName;
      },
      end: function() {
        currentTag = '';
      },
      attrStart: function(attrName) {
        const shouldModify = tagShouldBeModified(currentTag) &&
          attributeShouldBeModified(attrName);
        attributeAtIndexShouldBeModified.push(shouldModify);
      },
      attrEnd: noop,
      attrValue: noop,
      done: noop,
      special: noop
    });

    const alphaNumeric = 'A-Za-z0-9';
    const alphaNumericHU = '-:_' + alphaNumeric;
    const attributeRegexp = new RegExp('[' + alphaNumericHU + ']+\s*=\s*("[^"]*"|\'[^\']*\')', 'gm');
    const attributes = src.match(attributeRegexp);

    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i].slice(0, attributes[i].lastIndexOf('='));
      const value = attributes[i].slice(attributes[i].lastIndexOf('=') + 1);
      if (attributeAtIndexShouldBeModified[i]) {
        src = src.replace(attribute, attribute + ':from');
        if (value.includes("'")) { // jshint ignore:line
          src = src.replace(value, '"' + value + '"'); // jshint ignore:line
        } else {
          src = src.replace(value, "'" + value + "'"); // jshint ignore:line
        }
      }
    }
  }

  return src;
}
