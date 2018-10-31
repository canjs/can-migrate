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
    let parsedAttributes = [];

    let currentTag = '';

    // use parser to find all attributes and mark those that should be modified
    parser(src, {
      start: function(tagName) {
        currentTag = tagName;
      },
      end: function() {
        currentTag = '';
      },
      attrStart: function(attrName) {
        parsedAttributes.push({
          name: attrName,
          boolean: true,
          shouldBeModified: false
        });
      },
      attrEnd: noop,
      attrValue: function() {
        const currentAttr = parsedAttributes[parsedAttributes.length - 1];

        currentAttr.shouldBeModified = tagShouldBeModified(currentTag) &&
          attributeShouldBeModified(currentAttr.name);

        currentAttr.boolean = false;
      },
      done: noop,
      special: noop
    });

    // remove boolean attributes since the regex below will not find them
    parsedAttributes = parsedAttributes.filter(attr => !attr.boolean);

    // use a regex to find attributes in source and modify them in place
    // if they were marked to be modified by the parsing step above
    const alphaNumeric = 'A-Za-z0-9';
    const alphaNumericHU = '-:_' + alphaNumeric;
    const attributeRegexp = new RegExp('[' + alphaNumericHU + ']+\s*=\s*("[^"]*"|\'[^\']*\')', 'gm');
    const attributes = src.match(attributeRegexp);
    if(attributes)
      for (let i=0, parserIndex=0; i<attributes.length; i++) {
        const attribute = attributes[i].slice(0, attributes[i].indexOf('='));
        const value = attributes[i].slice(attributes[i].indexOf('=') + 1);

        let parsedAttribute = parsedAttributes[parserIndex];
        // skip any attributes not found during parsing since they do not need to be modified
        if (parsedAttribute && parsedAttribute.name === attribute) {
          parserIndex++;

          if (parsedAttribute.shouldBeModified) {
            src = src.replace(attribute, attribute + ':from');
            if (value.includes("'")) { // jshint ignore:line
              src = src.replace(value, '"' + value + '"'); // jshint ignore:line
            } else {
              src = src.replace(value, "'" + value + "'"); // jshint ignore:line
            }
          }
        }
      }
    }
  }

  return src;
}
