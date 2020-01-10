import { createClass, createMethod } from './classUtils';
import replaceRefs from './replaceRefs';

const transformInlineMap = (path) => path.value.arguments.length === 2 ?  path.value.arguments[0].value : 'Model';

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
    let refUpdate;

    var parentPathValueType = path.parentPath && path.parentPath.value && path.parentPath.value.type;

    // Replace variable declarations with class def
    if (parentPathValueType && (path.parentPath && path.parentPath.value && path.parentPath.value.type === 'VariableDeclarator')) {
      if (path.value.arguments.length > 1 && path.value.arguments[0].type === 'Literal') {
        varDeclaration = path.value.arguments[0].value;
      } else {
        varDeclaration = path.parentPath.value.id.name;
      }
      classPath = path.parentPath.parentPath.parentPath;
    // Handle default exports
    } else if (parentPathValueType && (path.parentPath && path.parentPath.value && path.parentPath.value.type === 'ExportDefaultDeclaration')) {
        // If we have "default" export if the DefineMap or DefineList has two arguments, use the first as the name of the class
        // fallback to using `Model` if not
        varDeclaration = transformInlineMap(path);
        classPath = path;
    } else if (parentPathValueType && (path.parentPath && path.parentPath.value && path.parentPath.value.type === 'AssignmentExpression')) {
      classPath = path.parentPath.parentPath;
      // Use either the first argument if there are more than one
      // or use the expression ie. Message.List = DefineList {...}
      // becomes class MessageList extends ObservableArray {...}
      varDeclaration = path.value.arguments.length > 1 ?
        path.value.arguments[0].value :
        `${path.parentPath.value.left.object.name}${path.parentPath.value.left.property.name}`;

      // Update refs if we are of type AssignmentExpression
      refUpdate = {
        objectName: path.parentPath.value.left.object.name,
        propertyName: path.parentPath.value.left.property.name
      };
    } else if (parentPathValueType && path.parentPath.value.type === 'Property') {
      // Handle Define.extend as a property like '#': DefineMap.extend
      // the class will be just class expression without a name
      classPath = path;
    }

    let propDefinitionsArg;
    let staticPropsDefinitionsArg;

    if (path.value.arguments.length === 3) {
      // Handle DefineMap.extend('Foo', {//staticProps}, {protoProps})
      staticPropsDefinitionsArg = path.value.arguments[1];
      propDefinitionsArg = path.value.arguments[2];
    }  else if (path.value.arguments.length === 2) {
      // Handle DefineMap.extend({//staticProps}, {protoProps})
      if (path.value.arguments[0].type === 'ObjectExpression') {
        staticPropsDefinitionsArg = path.value.arguments[0];
      }
      propDefinitionsArg = path.value.arguments[1];
    } else if (path.value.arguments.length === 1) {
      // Handle DefineMap.extend({protoProps})
      propDefinitionsArg = path.value.arguments[0];
    }

    // Check if we have an existing varDeclaration
    // if so let's create a new name to prevent clashing
    if (refUpdate) {
      const nameInUse = root
        .find(j.Identifier, {
          name: varDeclaration
        });

      varDeclaration = nameInUse.length > 0 ? `${varDeclaration}Model` : varDeclaration;

      // Update refs if we are of type AssignmentExpression
      updateRefs.push(Object.assign(refUpdate, { varDeclaration }));
    }

    debug(`Replacing ${varDeclaration} with ${extendedClassName} class`);

    let body = [
      createMethod({
        j,
        method: false, // Want this to be a getter
        name: 'props',
        blockStatement: [j.returnStatement(propDefinitionsArg)],
        isStatic: true
      })
    ];

    if (extendedClassName ==='ObservableObject') {
      let isSealed = false;
      if (staticPropsDefinitionsArg) {
        const staticProps = staticPropsDefinitionsArg.properties;
        isSealed = staticProps.contains('seal') && staticProps.seal.value.value === true;
      } else {
        isSealed = true;
      }

      if (isSealed) {
        body.push(j.classProperty(
          j.identifier('seal'),
          j.literal(true),
          null,
          true
        ));
      }
    }


    // if (staticPropsDefinitionsArg && extendedClassName ==='ObservableObject') {
    //   // Class level static properties
    //   const staticProps = staticPropsDefinitionsArg.properties;
    //   const isSealed = staticProps.contains('seal') && staticProps.seal.value.value === true;

    //   if (isSealed || !staticProps.contains('seal')) {
    //     // DefinedMap are seald by default
    //     body.push(j.classProperty(
    //       j.identifier('seal'),
    //       j.literal(true),
    //       null,
    //       true
    //     ));
    //   }
    // }

    const classDeclaration = createClass({
      j,
      className: varDeclaration ? varDeclaration : '',
      body: body,
      extendedClassName
    });

    if (classPath.node.comments && classPath.node.comments.length) {
      classDeclaration.comments = classDeclaration.comments ? classDeclaration.comments : [];
      classPath.node.comments.forEach(function(comment){
        if (comment.type === 'CommentLine') {
          classDeclaration.comments.push(j.commentLine(comment.value, true, false));
        }
        if (comment.type === 'CommentBlock') {
          classDeclaration.comments.push(j.commentBlock(comment.value, true, false));
        }
      });
    }

    j(classPath).replaceWith(classDeclaration);
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
