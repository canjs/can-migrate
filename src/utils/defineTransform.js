import { createClass, createMethod } from './classUtils';
import replaceRefs from './replaceRefs';

// can-define transform util
// used to transform can-define/map & can-define/list
export default function defineTransform ({
  j,
  source,
  objectName,
  propertyName = 'extend',
  extendedClassName,
  debug = () => {}
} = {}) {
  const root = j(source);
  const updateRefs = [];

  root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: {
        name: objectName
      },
      property: {
        name: propertyName
      }
    }
  })
  .forEach(path => {
    let varDeclaration;
    let classPath;

    // Replace variable declarations with class def
    if (path.parentPath && path.parentPath.value && path.parentPath.value.type === 'VariableDeclarator') {
      varDeclaration = path.parentPath.value.id.name;
      classPath = path.parentPath.parentPath.parentPath;
    } else if (path.parentPath && path.parentPath.value && path.parentPath.value.type === 'AssignmentExpression') {
      classPath = path.parentPath.parentPath;
      // Use either the first argument if there are more than one
      // or use the expression ie. Message.List = DefineList {...}
      // becomes class MessageList extends DefineArray {...}
      varDeclaration = path.value.arguments.length > 1 ?
        path.value.arguments[0].value :
        `${path.parentPath.value.left.object.name}${path.parentPath.value.left.property.name}`;

      // Update refs if we are of type AssignmentExpression
      updateRefs.push({
        objectName: path.parentPath.value.left.object.name,
        propertyName: path.parentPath.value.left.property.name,
        varDeclaration
      });
    }

    let propDefinitionsArg = path.value.arguments.length === 1 ?
      path.value.arguments[0] :
      path.value.arguments[1];

    debug(`Replacing ${varDeclaration} with ${extendedClassName} class`);

    j(classPath).replaceWith(
      createClass({
        j,
        className: varDeclaration,
        body: [
          createMethod({
            j,
            method: false, // Want this to be a getter
            name: 'define',
            blockStatement: [j.returnStatement(propDefinitionsArg)],
            isStatic: true
          })
        ],
        extendedClassName
      })
    );
  });
  
  // If we have changed the ref we need to update all references
  updateRefs.forEach(ref => {
    replaceRefs(j, root, {
      oldLocalName: ref,
      newLocalName: ref.varDeclaration
    });
  });
  
  return root.toSource();
}
