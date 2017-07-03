const webpack = require('webpack');

module.exports = {
	entry: './src/roguelike.js',
	output: {
		path: __dirname + '/dist',
		filename: 'rglk.min.js',
		library: 'rglk',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['es2015']
					}
				}]
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
};