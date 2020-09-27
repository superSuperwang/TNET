const path = require('path')
const { name } = require('./package.json')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: name,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  chainWebpack: (config) => {
    if (isProd) {
      config
        .optimization
        .minimize(true) // js文件最小化处理
        .splitChunks({ chunks: 'all' }) // 分割代码
    }

    // 移除 prefetch 插件，去除预加载
    config.plugins.delete('prefetch')
    config.resolve.alias.set('@', resolve('src'))

    // 全局注册
    // config.externals({
    //   vue: 'Vue',
    //   'vue-router': 'VueRouter',
    //   vuex: 'Vuex',
    //   axios: 'axios',
    //   'element-ui': 'Element'
    // })

    config.devtool('source-map')
  },
  configureWebpack: (config) => {
    // 生产环境去掉 console debugger
    if (isProd) {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
    }
  },

  // 打包后不生成map文件，减少包体积
  productionSourceMap: false,

  devServer: {
    open: true, // 运行后自动打开浏览器
    host: '0.0.0.0',// 服务器可从外部访问
    port: 8080,
    hotOnly: true// 热替换
  }
}
