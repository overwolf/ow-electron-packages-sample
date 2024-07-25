/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const rendererConfig = { ...config };
rendererConfig.target = 'electron-renderer';
rendererConfig.entry = {
  'renderer': './src/renderer/app/index.tsx',
  'preload': './src/preload/preload.ts',
  'exclusive': './src/renderer/exclusive/exclusive.ts'
};

rendererConfig.plugins.push(new HtmlWebpackPlugin({
  template: './src/renderer/osr/osr.html',
  filename: path.join(__dirname, './dist/renderer/osr/osr.html'),
  inject: false
}));

rendererConfig.plugins.push(new HtmlWebpackPlugin({
  template: './src/renderer/exclusive/exclusive.html',
  filename: path.join(__dirname, './dist/exclusive/exclusive.html'),
  chunks: ['exclusive'],
  inject: false
}));

rendererConfig.plugins.push(new HtmlWebpackPlugin({
  template: './src/renderer/index.html',
  filename: path.join(__dirname, './dist/renderer/index.html'),
  chunks: ['renderer'],
  inject: true,
}));

module.exports = rendererConfig;
