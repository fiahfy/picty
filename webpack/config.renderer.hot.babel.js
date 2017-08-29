import webpack from 'webpack';
import config from './config.renderer.babel';

const plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
]);

export default {
  ...config,
  output: {
    ...config.output,
    publicPath: 'http://localhost:3000/assets/',
  },
  plugins,
  devServer: {
    port: 3000,
    inline: true,
    hot: true,
  },
};
