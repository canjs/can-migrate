
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

export default function transformer(file) {
  let src = file.source;
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'stache') {
    const alphaNumeric = 'A-Za-z0-9';
    const alphaNumericHU = '-:_'+alphaNumeric;
    const attributeRegexp = new RegExp("["+alphaNumericHU+"]+\s*=\s*(\"[^\"]*\"|'[^']*')", 'gm'); // jshint ignore:line
    const attributes = src.match(attributeRegexp);
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i].slice(0, attributes[i].lastIndexOf('='));
      if (globalAttributes.indexOf(attribute) === -1 && !attribute.includes('aria') && !attribute.includes('data')) {
        src = src.replace(attribute, attribute + ':bind');
      }
    }
  }

  return src;
}
