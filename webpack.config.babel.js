import path from 'path';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';

const getConfig = (env, options) => {
	const isProduction = Boolean(options.mode === 'production');
	const config = {
		entry: {
			rglk: './src/library/js/index.js',
			demo: [
				'./src/demo/js/index.js',
				'./src/demo/scss/index.scss',
			],
		},
		output: {
			path: path.join(__dirname, '/build/'),
			filename: 'js/[name].js',
		},
		watch: !isProduction,
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
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
		resolve: {
			alias: {
				'rglk': path.join(__dirname, '/src/library/js/index.js'),
			}
		},
		plugins: [
			new ExtractTextPlugin('css/[name].css', {
				allChunks: true,
			}),
		],
		optimization: {
			minimize: isProduction,
		},
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
