const path = require('path');
const merge = require('webpack-merge');
const prod = require('./webpack.prod');

ghpages = {
  output: {
    path: path.resolve(__dirname, `../dist/${endpoint}`),
    publicPath: `http://github.com/UD-CISC374/coding-2-try-phaser-mvermont${endpoint}`
  }
};

module.exports = merge(prod, ghpages);
