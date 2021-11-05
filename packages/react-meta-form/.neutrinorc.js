let mode = require('@constgen/neutrino-mode')
let optimization = require('@constgen/neutrino-optimization')
let progress = require('@constgen/neutrino-progress')
let sourcemap = require('@constgen/neutrino-sourcemap')
let reactLoader = require('@constgen/neutrino-react-loader')

module.exports = {
   use: [
		mode(),
		// optimization(),
		progress(),
		sourcemap(),
      reactLoader(),
		function(neutrino){
			neutrino.config
				.target('web')
				.output
					.libraryTarget('umd')
		}
   ]
}