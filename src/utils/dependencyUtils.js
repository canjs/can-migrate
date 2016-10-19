import j from 'jscodeshift';
import importUtils from './importUtils';
import requireUtils from './requireUtils';
import makeDebug from 'debug';
const debug = makeDebug('can-migrate:addDependency');

export default {
  isUsingRequire(ast) {
    return ast.find(j.CallExpression, {callee: {name: 'require'}}).size() > 0;
  },
  isUsingImport(ast) {
    return ast.find(j.ImportDeclaration).size() > 0;
  },
  isUsingConst(ast) {
    return ast.find(j.VariableDeclaration, {kind: 'const'}).size() > 0;
  },
  find(ast, sourceValues) {
    let useImport = this.isUsingImport(ast);
    let found;
    if (useImport) {
      found = importUtils.find(ast, sourceValues).paths();
    } else {
      found = requireUtils.find(ast, sourceValues).paths();
    }
    if(found.length === 0) {
      return {
        size(){
          return 0;
        }
      };
    } else {
      if (useImport) {
        return j(found[0]);
      } else {
        return j(requireUtils.getDeclarator(found[0]));
      }
    }
  },
  create(ast, moduleName, variableName) {
    let useImport = this.isUsingImport(ast);
    let useConst = this.isUsingConst(ast);
    return useImport ? importUtils.create(moduleName, variableName) : requireUtils.create(moduleName, variableName, useConst ? 'const' : 'var');
  },
  add(ast, moduleName, variableName, afterSourceValues) {    
    debug(`Adding '${moduleName}' dependency to file`);
    if (this.find(ast, [moduleName]).size() > 0) {
      debug(`Dependency for '${moduleName}' already added, aborting`);
      return;
    }
    let useImport = this.isUsingImport(ast);
    let useRequire = this.isUsingRequire(ast);
    let useConst = this.isUsingConst(ast);

    debug(`File is using ${useConst ? 'const' : 'var'}`);
    if (!useRequire && !useImport) {
      debug(`File has no imports or requires defaulting to require`);
      useImport = false;
    } else {
      debug(`File is using ${useImport ? 'import' : 'require'}`);
    }
    debug(`Finding 'can' dependency`);
    let canDependency = this.find(ast, afterSourceValues);
    debug(`Creating  ${useImport ? 'import' : 'require'} for '${moduleName}'`);
    let dependency = this.create(ast, moduleName, variableName);
    
    if(canDependency.size() === 1) {
      debug(`Inserting  ${useImport ? 'import' : 'require'}'`);
      canDependency.insertBefore(dependency);
    } else {
      debug(`Did not find a 'can' dependency, aborting`);
    }
  },
  remove(ast, sourceValues) {
    this.find(ast, sourceValues).forEach((dependency) => {
      j(dependency).remove();
    });
  }
};
