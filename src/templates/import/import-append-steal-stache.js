/*jshint sub:true*/
import renameImport from '../../../utils/renameImport';
import makeDebug from 'debug';

export default function transformer(file, api, options) {
  const path = file.path;
  const debug = makeDebug(`can-migrate:import-append-steal-stache:${path}`);
  const src = file.source;
  const type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'js') {
    const printOptions = options.printOptions || {};
    const j = api.jscodeshift;
    const root = j(file.source);

    root
      .find(j.ImportDeclaration)
      .filter(p => {
        return  p.parent.node.type === 'Program' &&
                p.get('specifiers', 0, 'type').value !== 'ImportNamespaceSpecifier' &&
                /\.stache!?/.test(p.value.source.value);
      })
      .forEach(path => {
        const newSourceValue = path.value.source.value + (/!$/.test(path.value.source.value) ? 'steal-stache' : '!steal-stache');
        debug(`replacing import '${path.value.source.value}' with '${newSourceValue}`);
        renameImport(root, {
          oldSourceValues: [path.value.source.value],
          newSourceValue
        });
      });

    return root.toSource(printOptions);
  } else if (type === 'stache') {
    return src.replace(/<can-import[^>]*>/g, function($0) {
      if (/from="[^"]+\.stache!?"/.test($0)) {
        return $0.replace(/from="([^"]+\.stache)!?"/, 'from="$1!steal-stache"');
      } else {
        return $0;
      }
    });
  }
}
