const path = require('path');

module.exports = {
  mode: 'development', // Set mode to 'development'
  entry: './src/index.js',
  output: {
    filename: 'number-input-controls.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', // Injects styles into DOM
          'css-loader',   // Translates CSS into CommonJS
          'sass-loader',  // Compiles SCSS to CSS
        ],
      },
    ],
  },
};