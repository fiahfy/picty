import pkg from './package'

module.exports = {
  /*
   ** Build configuration
   */
  build: {
    extend(config, ctx) {
      // Extend only webpack config for client-bundle
      if (ctx.isClient) {
        config.target = 'electron-renderer'
        config.output.globalObject = 'this'
        config.module.rules.unshift({
          test: /\.worker\.js$/,
          loader: 'worker-loader',
        })
      }
      // Set relative path
      config.output.publicPath = './_nuxt/'
    },
  },

  /*
   ** Build modules
   */
  buildModules: ['@nuxt/typescript-build'],

  /*
   ** Global CSS
   */
  css: ['@mdi/font/css/materialdesignicons.css', 'typeface-roboto/index.css'],

  /*
   ** Generate configuration
   */
  generate: {
    dir: 'app',
  },

  /*
   ** Customize the progress-bar color
   */
  loading: false,

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.productName,
    meta: [{ hid: 'charset', charset: 'utf-8' }],
  },

  /*
   ** SPA or Universal
   */
  mode: 'spa',

  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      '@nuxtjs/vuetify',
      {
        customVariables: ['~/assets/variables.scss'],
        defaultAssets: false,
        theme: {
          themes: {
            light: {
              primary: '#ff4081',
              secondary: '#424242',
              accent: '#ff4081',
            },
            dark: {
              primary: '#ff4081',
              secondary: '#E0E0E0',
              accent: '#ff4081',
            },
          },
        },
      },
    ],
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/context-menu',
    '~/plugins/event-bus',
    '~/plugins/filter',
    '~/plugins/ipc-listener',
    '~/plugins/vue-composition-api',
    '~/plugins/vue-date-fns',
    '~/plugins/vue-long-press',
    '~/plugins/vuex-persistedstate',
  ],

  /*
   ** Router configuration
   */
  router: {
    mode: 'hash',
  },

  /*
   ** Source directory
   */
  srcDir: 'src',

  /*
   ** Vue configuration
   */
  vue: {
    config: {
      productionTip: false,
    },
  },
}
