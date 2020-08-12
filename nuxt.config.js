export default {
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
          test: /\.worker\.ts$/,
          loader: 'worker-loader',
        })
      }
      // Set relative path
      config.output.publicPath = './_nuxt/'
    },
  },

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/composition-api'],

  /*
   ** Auto import components
   */
  components: true,

  /*
   ** Global CSS
   */
  css: [
    '@mdi/font/css/materialdesignicons.css',
    'typeface-roboto/index.css',
    '~/assets/app.scss',
  ],

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
    title: process.env.npm_package_productName,
    meta: [{ hid: 'charset', charset: 'utf-8' }],
  },

  /*
   ** Nuxt rendering mode
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
    '~/plugins/electron-accelerator-formatter',
    '~/plugins/electron-context-menu',
    '~/plugins/event-bus',
    '~/plugins/ipc',
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
