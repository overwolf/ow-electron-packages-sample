/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const rendererConfig = { ...config };
rendererConfig.target = 'electron-renderer';
rendererConfig.entry = {
  'renderer': './src/renderer/renderer.ts',
  'preload': './src/preload/preload.ts',
  'exclusive': './src/renderer/exclusive.ts'
};

rendererConfig.plugins.push(new HtmlWebpackPlugin({
  template: './src/renderer/index.html',
  filename: path.join(__dirname, './dist/renderer/index.html'),
  chunks: ['renderer'],
  publicPath: '',
  inject: false
}));

rendererConfig.plugins.push(new HtmlWebpackPlugin({
  template: './src/renderer/osr.html',
  filename: path.join(__dirname, './dist/renderer/osr.html'),
  inject: false
}));

rendererConfig.plugins.push(new HtmlWebpackPlugin({
  template: './src/renderer/exclusive.html',
  filename: path.join(__dirname, './dist/exclusive/exclusive.html'),
  chunks: ['exclusive'],
  inject: false
}));

module.exports = rendererConfig;
