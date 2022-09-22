var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: {
    controller: './src/mobile/index.js',
    game: './src/game/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist/assets'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {loader: 'css-loader', options: {sourceMap: true, importLoaders: 1}},
          {loader: 'sass-loader', options: {sourceMap: true}},
        ],
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: 'src/mobile.html', to: '../index.html' },
          { from: 'src/web_display.html', to: '../game/index.html' },
          { from: 'src/web_display_test.html', to: '../test.html' },
        ]
      }
    )
  ],
  devServer: {
    proxy : [{path: '/ws_game', target: 'ws://localhost:3000', ws: true}, {path: '/ws_controller', target: 'ws://localhost:3000', ws: true}],
    historyApiFallback: true,
    devMiddleware: {
      publicPath: 'dist'
    },
    static: 'dist'
  },
  performance: {
    hints: false
  },
  devtool: 'source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
