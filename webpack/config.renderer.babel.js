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
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                `${__dirname}/../node_modules`,
              ],
            },
          },
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
};
