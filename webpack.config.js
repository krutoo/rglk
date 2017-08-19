var path = require('path'),
	webpack = require('webpack');

module.exports = [{
	// unminified
	entry: path.resolve(__dirname, 'src/roguelike.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'rglk.js',
		library: 'rglk',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}]
			}
		]
	}
}, {
	// minified
	entry: path.resolve(__dirname, 'src/roguelike.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'rglk.min.js',
		library: 'rglk',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}]
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
}];