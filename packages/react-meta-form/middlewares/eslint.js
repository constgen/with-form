let deepmerge = require('deepmerge')

module.exports = function () {
	return function (neutrino) {
		let lintRule = neutrino.config.module.rules.get('lint')
		let library  = neutrino.config.output.get('library')

		if (lintRule) {
			lintRule.use('eslint').tap(options => deepmerge(options, {
				baseConfig: {
					globals: [library].filter(Boolean),
					env    : {
						node    : true,
						commonjs: true
					}
				}
			}))
		}
	}
}