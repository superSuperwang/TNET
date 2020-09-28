const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
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

    // externals功能 将静态资源放在CDN上 打包时不会打包至bundle 而是在运行时动态获取
    // config.externals({
    //   vue: 'Vue',
    //   'vue-router': 'VueRouter',
    //   vuex: 'Vuex',
    //   axios: 'axios',
    //   'element-ui': 'Element'
    // })

    config.devtool('source-map')
  },
  configureWebpack: {
    plugins: [
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require('./public/vendor/vendor-manifest.json')
      }),
      // 打包时去掉debugger console
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true, //debugger
            drop_console: true,// console
            pure_funcs: ['console.log'] // 移除console
          },
        },
        sourceMap: false,
        parallel: true,
      })
    ]
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
