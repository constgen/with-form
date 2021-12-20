let path = require('path')
let deepmerge = require('deepmerge')
let mode = require('@constgen/neutrino-mode')
let optimization = require('@constgen/neutrino-optimization')
let progress = require('@constgen/neutrino-progress')
let sourcemap = require('@constgen/neutrino-sourcemap')
let reactLoader = require('@constgen/neutrino-react-loader')
let analysis        = require('@constgen/neutrino-analysis')
let clean        = require('@neutrinojs/clean')
let eslint               = require('./middlewares/eslint')
let repl = require('repl')

let builtinModules = require('repl')._builtinLibs

function umdPreset(customSettings = {}){ 
	return function (neutrino){		
		// console.log({...neutrino.options})
		const MODULES = path.join(__dirname, 'node_modules')
		let packageJson = neutrino.options.packageJson
		let peerModules = Object.keys(packageJson.peerDependencies || {})
		let defaultSettings = {
			filename: packageJson.name,
			library: '',
			externals: [
				...builtinModules,
				...peerModules
			],
			globals: {
				__filename: true,
				__dirname: true,
				global: true,
				process: false,
				setImmediate: false,
				Buffer: false
			},
			minify: true
		}
		let settings = deepmerge(defaultSettings, customSettings)
		

		neutrino.use(mode())
		neutrino.use(clean())
		neutrino.use(optimization({chunks: false, minimize: settings.minify}))
		neutrino.use(progress())
		neutrino.use(sourcemap({prod: true, dev: true}))
      neutrino.use(reactLoader())

		Object.entries(neutrino.options.mains).forEach(([name, config]) =>
			neutrino.config.entry(name).add(config.entry)
		);

		neutrino.config
			.target('web')
			.context(neutrino.options.root)
			.output
				.path(neutrino.options.output)
				.publicPath('./')
				.filename((settings.filename ? settings.filename : '[name]') + '.js')
				.library(settings.library)
				.libraryTarget('umd')
				.chunkFilename('[name].js')
				.end()
			.resolve
				.modules
					.add('node_modules')
					.add(MODULES)
					.end()
				.extensions
					.merge(['.wasm'])
					.merge([...neutrino.options.extensions.map(extension => `.${extension}`)])
					.merge(['.js', '.json'])
					.end()
				.end()
			.resolveLoader
				.modules
					.add('node_modules')
					.add(MODULES)
					.end()
				.end()
			.externals(settings.externals)
			.node
				.merge(settings.globals)
				.end()
			.devServer
				.port(5000)

				
		neutrino.use(analysis())
		neutrino.use(eslint())
	}
}

module.exports = {
	options: {
		root: __dirname,
		output: 'dist'
	},
   use: [
		umdPreset({filename: '[name]'})
   ]
}