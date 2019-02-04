const path = require('path');
const fs = require('fs');

const Webpack = require('webpack');
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const DtsBundleWebpack = require('dts-bundle-webpack');

const pkg = require('../package.json');

const resolveApp = relativePath => {
	return path.resolve(fs.realpathSync(process.cwd()), relativePath);
};

const packageName = pkg.name;
const mode = 'production';

let outputFile;

if (mode === 'production') {
	outputFile = packageName + '.min.js';
} else {
	outputFile = packageName + '.js';
}

const paths = {
	dist: resolveApp('lib'),
	nodeModules: resolveApp('node_modules'),
	packageJSON: resolveApp('package.json'),
	src: resolveApp('src'),
	tsConfig: resolveApp('tsconfig.json'),
	tsLint: resolveApp('tslint.json')
};

const config = {
	externals: [
		'fs',
		'module',
		'path',
		'any-promise',
		'websocket',
		'json-bigint',
		'web-eth-accounts'
	],
	target: 'node',
	node: {},
	resolve: {
		extensions: ['.js', '.ts', '.json'],
		alias: {
			scrypt: 'js-scrypt',
			websocket: path.resolve(__dirname, '../')
		}
	},
	plugins: [
		new Webpack.IgnorePlugin(/^(?:electron|ws)$/),
		new DtsBundleWebpack({
			name: packageName,
			baseDir: './dist',
			main: './dist/index.d.ts',
			out: '../lib/index.d.ts'
		}),
		new ForkTSCheckerWebpackPlugin({
			async: false,
			tsconfigPath: paths.tsConfig,
			tslintPath: paths.tsLint,
			watch: paths.src,
			memoryLimit: 4000,
			workers: 2
		})
	],
	performance: {
		hints: false
	},
	entry: { index: './src/index.ts' },

	mode: mode,
	output: {
		path: paths.dist,
		filename: outputFile,
		library: packageName,
		libraryTarget: 'umd',
		umdNamedDefine: true,
		globalObject: "typeof self !== 'undefined' ? self : this"
	},
	module: {
		rules: [
			{
				oneOf: [
					{
						include: paths.src,
						loader: require.resolve('babel-loader'),
						options: {
							compact: true
						},
						test: /\.(js|jsx|mjs)$/
					},
					{
						exclude: paths.nodeModules,
						include: paths.src,
						test: /\.(ts|tsx)$/,
						use: [
							{
								loader: require.resolve('ts-loader'),
								options: {
									transpileOnly: true
								}
							}
						]
					},
					{
						exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
						loader: require.resolve('file-loader'),
						options: {
							name: 'static/media/[name].[hash:8].[ext]'
						}
					}
				]
			}
		]
	}
};

module.exports = config;
