/**
 * Utility for replacing an import statement of the form:
 *   `import <oldLocalName> from <oldSourceValue>
 * Then it replaces references of <oldLocalName> with the new local name.
 *
 * Options:
 *   oldSourceValues {Array<String>} possible values for <oldSourceValue>
 *   newSourceValue {String} new source value to use (will replace <oldSourceValue>)
 *   newLocalName {String} new local name (will replace <oldLocalName>)
 */
import importUtils from './importUtils';

export default function replaceImport(ast, options) {
  if(!options.oldSourceValues || !options.newSourceValue) {
    return;
  }
  let oldLocalName;
  importUtils.find(ast, options.oldSourceValues)
  .forEach(importStatement => {
    oldLocalName = importUtils.rename(importStatement, options.newSourceValue, options.newLocalName);
  });
  return oldLocalName;
}

/**
 * updateImport
 * @param {jscodshift} j
 * @param {Object} file
 * @param {Object} options
 * Updates the left hand of the import
 *
 * import Component from 'can' /-> import CanStachDefineElement from 'can'
 * import { Component } from 'can' /-> import { CanStacheDefineElement } from 'can'
 */
export function updateImport (j, root, { oldValue, newValue }) {
  root
    .find(j.ImportDeclaration)
    .filter(p => {
      return  p.parent.node.type === 'Program' &&
              p.get('specifiers', 0, 'type').value !== 'ImportNamespaceSpecifier' &&
              p.value.source.value === 'can' ||
              /\/\/unpkg.com\/can@5?(\.[0-9]+)?(\.[0-9]+)?\/everything.mjs/.test(p.value.source.value);
    })
    .forEach(path => {
      path.value.specifiers.forEach((specifier, index) => {
        const importedName = specifier.imported ? specifier.imported.name : 'default';
        if (importedName === oldValue) {
          // Update the existing value
          path.value.specifiers[index] = j.importSpecifier(j.identifier(newValue), j.identifier(newValue));
          // Sort the array alphabetically
          path.value.specifiers.sort(importSort);
        }
      });
    });
}

/**
 * addImport
 * @param {jscodshift} j
 * @param {Object} file
 * @param {Object} options
 * Adds the import
 * Will add to existing deconstructed import
 */
export function addImport (j, root, { importName, importIncludes = 'can', hasSiblings = [] } = {}) {
  root
    .find(j.ImportDeclaration)
    .filter(p => {
      return p.parent.node.type === 'Program';
    })
    .forEach(path => {
      if (path.value.source.value.includes(importIncludes) && (hasSiblings.length > 0 ? path.value.specifiers.some(i => i.imported && hasSiblings.includes(i.imported.name)) : true)) {
        if (path.value.specifiers.length && path.value.specifiers[0].type !== 'ImportDefaultSpecifier') {
          if (!path.value.specifiers.find(i => i.imported && i.imported.name === importName)) {
            path.value.specifiers.push(j.importSpecifier(j.identifier(importName), j.identifier(importName)));
            // Sort the array alphabetically
            path.value.specifiers.sort(importSort);
          }
        }
      }
    });
}

function importSort (a, b) {
  if (a.imported.name.toLowerCase() > b.imported.name.toLowerCase()) {
    return 1;
  } else if (a.imported.name.toLowerCase() < b.imported.name.toLowerCase()) {
    return -1;
  } else {
    return 0;
  }
}
