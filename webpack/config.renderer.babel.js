import config from './config.base.babel';

export default {
  ...config,
  target: 'electron-renderer',
  entry: './renderer.js',
  output: {
    path: `${__dirname}/../app/assets/`,
    publicPath: './assets/',
    filename: 'js/renderer.js',
  },
  module: {
    rules: [
      ...config.module.rules,
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          },
          // other vue-loader options go here
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
        ],
      },
      {
        test: /\.(jpg|gif|png|svg)$/,
        loader: 'url-loader',
        options: {
          limit: '10000',
          name: 'img/[name].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          limit: '10000',
          name: 'font/[name].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
};
