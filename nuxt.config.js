export default {
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
    },
  },

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
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

  components: true,

  css: [
    '@mdi/font/css/materialdesignicons.css',
    'typeface-roboto/index.css',
    '~/assets/app.scss',
  ],

  generate: {
    dir: 'app',
  },

  loading: false,

  head: {
    title: process.env.npm_package_productName,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [{ charset: 'utf-8' }],
  },

  modules: [],

  plugins: [
    '~/plugins/electron-accelerator-formatter',
    '~/plugins/electron-context-menu',
    '~/plugins/event-bus',
    '~/plugins/ipc',
    '~/plugins/vue-date-fns',
    '~/plugins/vue-long-press',
    '~/plugins/vuex-persistedstate',
  ],

  router: {
    mode: 'hash',
  },

  srcDir: 'src',

  ssr: false,

  target: 'static',

  vue: {
    config: {
      productionTip: false,
    },
  },
}
