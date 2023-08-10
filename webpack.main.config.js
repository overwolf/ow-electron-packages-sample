const path = require('path');
/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.base.config');

const mainConfig = { ...config };
mainConfig.target = 'electron-main';
mainConfig.entry = {
  'index': './src/browser/index.ts',
};

mainConfig.output = {
  path: path.join(__dirname, './dist/browser'),
  filename: '[name].js',
}

module.exports = mainConfig;
