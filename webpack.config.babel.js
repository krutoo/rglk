import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';

const getConfig = () => {
	const isProduction = Boolean(process.env.NODE_ENV === 'production');
	const config = {
			entry: './src/index.js',
			output: {
				path: __dirname + './build/js/',
				filename: 'rglk.js',
			},
			watch: !isProduction,
			module: {
				rules: [
					{
						test: /\.js$/,
						loader: 'babel-loader',
						options: {
							// sourceMap: true,
						},
					},
				],
			},
			plugins: [
				new ExtractTextPlugin('../css/bundle.css', {
					allChunks: true,
				}),
			],
		};
	if (isProduction) {
		config.plugins.push(
			new OptimizeCssAssetsPlugin(),
		);
		config.optimization = {
			minimizer: [
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: true
				}),
			],
		};
	}
	return config;
};

export default getConfig;
