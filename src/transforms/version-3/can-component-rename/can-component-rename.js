// This is a generated file, see src/templates/can-extend/can-extend.js
import getConfig from '../../../utils/getConfig';
import propertyUtils from '../../../utils/propertyUtils';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const debug = makeDebug(`can-migrate:can-component-rename:${file.path}`);
  const config = getConfig(options.config);
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const componentName = config.moduleToName['can-component'];
  const root = j(file.source);
  const leakScopeTrue = j.property(
    'init',
    j.identifier('leakScope'),
    j.literal(true)
  );
  root.find(j.CallExpression).filter((expression) => {
    // can.Component
    if(expression.value.callee && expression.value.callee.object) {
      if(expression.value.callee.object.type === 'MemberExpression') {
        return expression.value.callee.object.property.name === 'Component';
      } else {
        return expression.value.callee.object.name === componentName;
      }
    }
  })
  .forEach((expression) => {
    const eventsProp = propertyUtils.find(expression.value.arguments[0], 'events');
    const leakScope = propertyUtils.find(expression.value.arguments[0], 'leakScope');

    debug(`Adding leakScope: true`);
    if(!leakScope) {
      expression.value.arguments[0].properties.push(leakScopeTrue);
    }

    debug(`Renaming 'template' -> 'view'`);
    propertyUtils.rename(expression.value.arguments[0], 'template', 'view');
    if(eventsProp) {
      debug(`Renaming 'removed' -> 'beforeremove'`);
      propertyUtils.rename(eventsProp.value, 'removed', '{element} beforeremove', true);
    }
  });
  return root.toSource(printOptions);
}
