/* eslint-disable @typescript-eslint/no-var-requires */
const mainConfig = require('./webpack.main.config');
const rendererConfig = require('./webpack.renderer.config');

module.exports = [mainConfig, rendererConfig];
