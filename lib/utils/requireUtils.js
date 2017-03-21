'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

var _preserveQuote = require('./preserveQuote');

var _preserveQuote2 = _interopRequireDefault(_preserveQuote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = {
  find: function find(ast, moduleName) {
    return ast.find(_jscodeshift2.default.CallExpression, {
      callee: {
        name: 'require'
      }
    }).filter(function (requireStatement) {
      return requireStatement.value.arguments[0].type === 'Literal' && [].concat(_toConsumableArray(moduleName)).indexOf(requireStatement.value.arguments[0].value) !== -1;
    });
  },
  getDeclarator: function getDeclarator(requireStatement) {
    var statement = requireStatement;
    var found = false;
    while (!found && statement.parent) {
      if (statement.node.type === 'VariableDeclarator') {
        found = true;
      }
      statement = statement.parent;
    }
    return statement;
  },
  rename: function rename(requireStatement, newModuleName, newVariableName) {
    var oldLocalName = void 0;
    if (newVariableName && requireStatement.parent.parent.value.declarations && requireStatement.parent.parent.value.declarations.length === 1) {
      oldLocalName = requireStatement.parent.parent.value.declarations[0].id.name;
      requireStatement.parent.parent.value.declarations[0].id.name = newVariableName;
    }
    requireStatement.node.arguments[0].value = (0, _preserveQuote2.default)(requireStatement.node.arguments[0].raw, newModuleName);
    return oldLocalName;
  },
  create: function create(moduleName, variableName) {
    var kind = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'var';

    var declaration = void 0;
    var variable = void 0;
    var nameIdentifier = void 0;
    var requireCall = _jscodeshift2.default.callExpression(_jscodeshift2.default.identifier('require'), [_jscodeshift2.default.literal(moduleName)]);

    if (!variableName) {
      declaration = _jscodeshift2.default.expressionStatement(requireCall);
      return declaration;
    }
    // multiple variable names indicates a destructured require
    if (Array.isArray(variableName)) {
      var variableIds = variableName.map(function (v) {
        var property = _jscodeshift2.default.property('init', _jscodeshift2.default.identifier(v), _jscodeshift2.default.identifier(v));
        property.shorthand = true;
        return property;
      });
      nameIdentifier = _jscodeshift2.default.objectPattern(variableIds);
      variable = _jscodeshift2.default.variableDeclarator(nameIdentifier, requireCall);
    } else {
      // else returns `import can from 'can'`
      nameIdentifier = _jscodeshift2.default.identifier(variableName); //import var name
      variable = _jscodeshift2.default.variableDeclarator(nameIdentifier, requireCall);
    }
    declaration = _jscodeshift2.default.variableDeclaration(kind, [variable]);

    return declaration;
  }
};
module.exports = exports['default'];