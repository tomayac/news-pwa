const path = require('path');

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            'presets': [
              [
                '@babel/env', {
                  'targets': {
                    'firefox': '48',
                    'chrome': '41',
                  },
                  'useBuiltIns': 'usage',
                },
              ],
              'minify',
            ],
          },
        },
      },
    ],
  },
  mode: 'production',
};
