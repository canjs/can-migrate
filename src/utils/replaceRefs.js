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

export default function replaceRefs(j, root, options) {
  if(!options.oldLocalName || !options.newLocalName) {
    return;
  }
  // Allow for MemberExpression replacements
  // Message.connection = realtimeRestModel({
  //   List: Message.List
  // });
  // Converted to:
  // Message.connection = realtimeRestModel({
  //   List: MessageList
  // });
  if (typeof options.oldLocalName === 'object') {
    // Replace <oldLocalName.objectName>.<oldLocalName.propertyName>;
    root.find(j.MemberExpression, {
      object: {
        name: options.oldLocalName.objectName
      },
      property: {
        name: options.oldLocalName.propertyName
      }
    }).forEach(assignmentExpression => {
      j(assignmentExpression).replaceWith(j.identifier(options.newLocalName));
    });
  } else {
    // Replace <oldLocalName>();
    root.find(j.CallExpression, {
      callee: {
        name: options.oldLocalName
      }
    }).forEach(expressionStatement => {
      expressionStatement.node.callee.name = options.newLocalName;
    });
    // Replace new <oldLocalName>();
    root.find(j.NewExpression, {
      callee: {
        name: options.oldLocalName
      }
    }).forEach(newStatement => {
      newStatement.node.callee.name = options.newLocalName;
    });
    // Replace <oldLocalName>.extend({...});
    root.find(j.CallExpression, {
      callee: {
        object: {
          name: options.oldLocalName
        }
      }
    }).forEach(expressionStatement => {
      expressionStatement.node.callee.object.name = options.newLocalName;
    });
    // Replace { Type: <oldLocalName> }
    root.find(j.Property, {
      value: {
        name: options.oldLocalName
      }
    }).forEach(property => {
      property.node.value.name = options.newLocalName;
    });
    // Replace Object.assign({}, <oldLocalName>)
    root.find(j.Identifier, {
      name: options.oldLocalName
    }).filter((identifier) => (
      // Don't replace function parameters
      identifier.parent.value.type !== 'FunctionExpression' &&
      identifier.parent.value.type !== 'FunctionDeclaration' &&
      // Don't replace if it is part of an Object ie. `obj.<oldLocalName>`
      identifier.parent.value.type !== 'MemberExpression' &&
      // Don't replace if it is the key on an Object i. foo = { <oldLocalName>: bar }
      identifier.parent.value.type !== 'Property'
    )).forEach(identifier => {
      identifier.node.name = options.newLocalName;
    });
    root.find(j.Identifier, {
      object: {
        name: options.oldLocalName
      }
    }).forEach(identifier => {
      identifier.node.name = options.newLocalName;
    });
    // Replace <oldLocalName>.on
    root.find(j.MemberExpression, {
      object: {
        name: options.oldLocalName
      }
    }).forEach(memberExpression => {
      memberExpression.node.object.name = options.newLocalName;
    });
  }
}
