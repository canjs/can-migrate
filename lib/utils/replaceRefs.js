'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replaceRefs;
/**
 * Utility for replacing all mentions of an identifier:
 * ```js
 *   <oldLocalName>(...);
 *   new <oldLocalName>();
 *   <oldLocalName>.extend({...});
 *   {
 *     Type: <oldLocalName>
 *   }
 *   Object.assign({}, <oldLocalName>)
 *   <oldLocalName>.on
 * ```
 * <oldLocalName> will be replaced with <newLocalName>.
 *
 * Options:
 *   oldLocalName {String} old local name to search for
 *   newLocalName {String} new local name (will replace <oldLocalName>)
 */

function replaceRefs(j, root, options) {
  if (!options.oldLocalName || !options.newLocalName) {
    return;
  }
  // Replace <oldLocalName>();
  root.find(j.CallExpression, {
    callee: {
      name: options.oldLocalName
    }
  }).forEach(function (expressionStatement) {
    expressionStatement.node.callee.name = options.newLocalName;
  });
  // Replace new <oldLocalName>();
  root.find(j.NewExpression, {
    callee: {
      name: options.oldLocalName
    }
  }).forEach(function (newStatement) {
    newStatement.node.callee.name = options.newLocalName;
  });
  // Replace <oldLocalName>.extend({...});
  root.find(j.CallExpression, {
    callee: {
      object: {
        name: options.oldLocalName
      }
    }
  }).forEach(function (expressionStatement) {
    expressionStatement.node.callee.object.name = options.newLocalName;
  });
  // Replace { Type: <oldLocalName> }
  root.find(j.Property, {
    value: {
      name: options.oldLocalName
    }
  }).forEach(function (property) {
    property.node.value.name = options.newLocalName;
  });
  // Replace Object.assign({}, <oldLocalName>)
  root.find(j.Identifier, {
    name: options.oldLocalName
  }).filter(function (identifier) {
    return (
      // Don't replace function parameters
      identifier.parent.value.type !== 'FunctionExpression' && identifier.parent.value.type !== 'FunctionDeclaration' &&
      // Don't replace if it is part of an Object ie. `obj.<oldLocalName>`
      identifier.parent.value.type !== 'MemberExpression'
    );
  }).forEach(function (identifier) {
    identifier.node.name = options.newLocalName;
  });
  root.find(j.Identifier, {
    object: {
      name: options.oldLocalName
    }
  }).forEach(function (identifier) {
    identifier.node.name = options.newLocalName;
  });
  // Replace <oldLocalName>.on
  root.find(j.MemberExpression, {
    object: {
      name: options.oldLocalName
    }
  }).forEach(function (memberExpression) {
    memberExpression.node.object.name = options.newLocalName;
  });
}
module.exports = exports['default'];