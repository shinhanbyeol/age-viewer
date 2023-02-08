const resolve = require('path').resolve

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: ['./build/bin/www.js'],
  output: {
    filename: "age-viewer.js",
    path: resolve(__dirname, '../dist/bin/www')
  },
}