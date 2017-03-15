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
    return ast.find(_jscodeshift2.default.ImportDeclaration).filter(function (importStatement) {
      return importStatement.value.source.type === 'Literal' && [].concat(_toConsumableArray(moduleName)).indexOf(importStatement.value.source.value) !== -1;
    });
  },
  rename: function rename(importStatement, newModuleName, newVariableName) {
    var oldLocalName = void 0;
    if (newVariableName && importStatement.value.specifiers.length === 1) {
      oldLocalName = importStatement.value.specifiers[0].local.name;
      importStatement.value.specifiers[0].local.name = newVariableName;
    }
    importStatement.value.source.value = (0, _preserveQuote2.default)(importStatement.value.source.raw[0], newModuleName);
    return oldLocalName;
  },
  create: function create(moduleName, variableName) {
    var declaration = void 0;
    var variable = void 0;
    var nameIdentifier = void 0;

    // if no variable name, return `import 'can'`
    if (!variableName) {
      declaration = _jscodeshift2.default.importDeclaration([], _jscodeshift2.default.literal(moduleName));
      return declaration;
    }

    // multiple variable names indicates a destructured import
    if (Array.isArray(variableName)) {
      var variableIds = variableName.map(function (v) {
        return _jscodeshift2.default.importSpecifier(_jscodeshift2.default.identifier(v), _jscodeshift2.default.identifier(v));
      });

      declaration = _jscodeshift2.default.importDeclaration(variableIds, _jscodeshift2.default.literal(moduleName));
    } else {
      // else returns `import can from 'can'`
      nameIdentifier = _jscodeshift2.default.identifier(variableName); //import var name
      variable = _jscodeshift2.default.importDefaultSpecifier(nameIdentifier);

      declaration = _jscodeshift2.default.importDeclaration([variable], _jscodeshift2.default.literal(moduleName));
    }

    return declaration;
  }
};
module.exports = exports['default'];