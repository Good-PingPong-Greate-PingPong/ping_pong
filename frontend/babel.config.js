module.exports = {
	presets: [
	  [
		'@babel/preset-env',
		{
		  targets: {
			browsers: ['>0.25%', 'not ie 11', 'not op_mini all']
		  },
		  useBuiltIns: 'usage',
		  corejs: 3,
		  modules: false
		}
	  ],
	  '@babel/preset-typescript'
	],
	plugins: [
	  ['@babel/plugin-proposal-decorators', { legacy: true }],
	  ['@babel/plugin-proposal-class-properties', { loose: true }],
	  '@babel/plugin-transform-runtime'
	]
  };
  