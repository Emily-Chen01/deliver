var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'
const px2rem = require('postcss-px2rem')

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  // 配置remUnit

postcss: function() {

  return [px2rem({remUnit: 75})];

}
}
