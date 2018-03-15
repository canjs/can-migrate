import dependencyUtils from '../../../utils/dependencyUtils';

export default function transformer(file, api) {
	const path = file.path;
	const type = path.slice(path.lastIndexOf('.') + 1);
	const j = api.jscodeshift;
	const root = j(file.source);

	if (type === 'js') {
		let routeImportVariable = '';

		// find the name for the can-route import, ie 'canRoute' in:
		// 'import canRoute from 'can-route';
		dependencyUtils
			.find(root, ['can-route/can-route', 'can-route'])
			.find(j.ImportDefaultSpecifier)
			.forEach((foo) => {
				routeImportVariable = foo.value.local.name;
			});

		// find all the places that route.ready is called
		root.find(j.MemberExpression, {
			object: {
				name: routeImportVariable
			},
			property: {
				name: 'ready'
			}
		})
		// replace it with route.start
		.replaceWith(function () {
			return j.memberExpression(
				j.identifier(routeImportVariable),
				j.identifier('start')
			);
		});
	}

	return root.toSource();
}
