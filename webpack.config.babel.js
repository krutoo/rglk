import path from 'path';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';

const libraryName = 'rglk',
	outputFileName = 'rglk.js',
	outputDirectoryName = 'build';

const getConfig = (env, options) => {
	const isProduction = Boolean(options.mode === 'production');
	console.log(isProduction);
	const config = {
			entry: './src/index.js',
			output: {
				library: libraryName,
				libraryTarget: 'umd',
				path: path.join(__dirname, outputDirectoryName),
				filename: `js/${outputFileName}`,
			},
			watch: !isProduction,
			devtool: 'source-map',
			module: {
				rules: [
					{
						test: /\.js$/,
						loader: 'babel-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						test: /\.scss$/,
						loader: ExtractTextPlugin.extract({
							fallback: 'style-loader',
							use: 'css-loader!sass-loader',
						}),
					}
				],
			},
			plugins: [
				new ExtractTextPlugin('css/bundle.css', {
					allChunks: true,
				}),
			],
			optimization: {
				minimize: isProduction,
			}
		};
	if (isProduction) {
		config.plugins.push(
			new OptimizeCssAssetsPlugin(),
		);
		config.optimization.minimizer = [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true,
			}),
		];
	}
	return config;
};

export default getConfig;
