'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

var _importUtils = require('./importUtils');

var _importUtils2 = _interopRequireDefault(_importUtils);

var _requireUtils = require('./requireUtils');

var _requireUtils2 = _interopRequireDefault(_requireUtils);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('can-migrate:dependencyUtils');

exports.default = {
  isUsingRequire: function isUsingRequire(ast) {
    return ast.find(_jscodeshift2.default.CallExpression, { callee: { name: 'require' } }).size() > 0;
  },
  isUsingImport: function isUsingImport(ast) {
    return ast.find(_jscodeshift2.default.ImportDeclaration).size() > 0;
  },
  isUsingConst: function isUsingConst(ast) {
    return ast.find(_jscodeshift2.default.VariableDeclaration, { kind: 'const' }).size() > 0;
  },
  find: function find(ast, sourceValues) {
    var useImport = this.isUsingImport(ast);
    var found = void 0;
    if (useImport) {
      found = _importUtils2.default.find(ast, sourceValues).paths();
    } else {
      found = _requireUtils2.default.find(ast, sourceValues).paths();
    }
    if (found.length === 0) {
      return {
        size: function size() {
          return 0;
        }
      };
    } else {
      if (useImport) {
        return (0, _jscodeshift2.default)(found[0]);
      } else {
        return (0, _jscodeshift2.default)(_requireUtils2.default.getDeclarator(found[0]));
      }
    }
  },
  create: function create(ast, moduleName, variableName) {
    var useImport = this.isUsingImport(ast);
    var useConst = this.isUsingConst(ast);
    return useImport ? _importUtils2.default.create(moduleName, variableName) : _requireUtils2.default.create(moduleName, variableName, useConst ? 'const' : 'var');
  },
  add: function add(ast, moduleName, variableName, afterSourceValues) {
    debug('Adding \'' + moduleName + '\' dependency to file');
    if (this.find(ast, [moduleName]).size() > 0) {
      debug('Dependency for \'' + moduleName + '\' already added, aborting');
      return;
    }
    var useImport = this.isUsingImport(ast);
    var useRequire = this.isUsingRequire(ast);
    var useConst = this.isUsingConst(ast);

    debug('File is using ' + (useConst ? 'const' : 'var'));
    if (!useRequire && !useImport) {
      debug('File has no imports or requires defaulting to require');
      useImport = false;
    } else {
      debug('File is using ' + (useImport ? 'import' : 'require'));
    }
    debug('Finding \'can\' dependency');
    var canDependency = this.find(ast, afterSourceValues);
    debug('Creating  ' + (useImport ? 'import' : 'require') + ' for \'' + moduleName + '\'');
    var dependency = this.create(ast, moduleName, variableName);

    if (canDependency.size() === 1) {
      debug('Inserting  ' + (useImport ? 'import' : 'require') + '\'');
      canDependency.insertBefore(dependency);
    } else {
      debug('Did not find a \'can\' dependency, aborting');
    }
  },
  remove: function remove(ast, sourceValues) {
    this.find(ast, sourceValues).forEach(function (dependency) {
      (0, _jscodeshift2.default)(dependency).remove();
    });
  }
};
module.exports = exports['default'];