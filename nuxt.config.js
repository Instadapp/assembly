export default {
  ssr: !process.env.VERCEL,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Assembly',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'The Open Source Dashboard for the Instadapp Protocol' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: "msapplication-TileColor", content: "#ffffff" },
      { name: "msapplication-TileImage", content: "/ms-icon-144x144.png" },
      { name: "theme-color", content: "#ffffff" },

      // FB
      { hid: 'og_type', property: 'og:type', content: 'website' },
      { hid: 'og_url', property: 'og:url', content: 'https://assembly.instadapp.io/' },
      { hid: 'og_title', property: 'og:title', content: 'Assembly' },
      {
        hid: 'og_image',
        property: 'og:image',
        content: `https://assembly.instadapp.io/social.jpg`,
      },
      {
        hid: 'og_description',
        property: 'og:description',
        content: 'The Open Source Dashboard for the Instadapp Protocol',
      },

      // Twitter
      { hid: 'twitter_type', property: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter_url', property: 'twitter:url', content: 'https://assembly.instadapp.io/' },
      { hid: 'twitter_title', property: 'twitter:title', content: 'Assembly' },
      {
        hid: 'twitter_image',
        property: 'twitter:image',
        content: `https://assembly.instadapp.io/social.jpg`,
      },
      {
        hid: 'twitter_description',
        property: 'twitter:description',
        content: 'The Open Source Dashboard for the Instadapp Protocol',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: "apple-touch-icon", sizes: "57x57", href: "/apple-icon-57x57.png" },
      { rel: "apple-touch-icon", sizes: "60x60", href: "/apple-icon-60x60.png" },
      { rel: "apple-touch-icon", sizes: "72x72", href: "/apple-icon-72x72.png" },
      { rel: "apple-touch-icon", sizes: "76x76", href: "/apple-icon-76x76.png" },
      { rel: "apple-touch-icon", sizes: "114x114", href: "/apple-icon-114x114.png" },
      { rel: "apple-touch-icon", sizes: "120x120", href: "/apple-icon-120x120.png" },
      { rel: "apple-touch-icon", sizes: "144x144", href: "/apple-icon-144x144.png" },
      { rel: "apple-touch-icon", sizes: "152x152", href: "/apple-icon-152x152.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-icon-180x180.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/android-icon-192x192.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "manifest", href: "/manifest.json" },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],
  env: {
    PORTIS_ID: process.env.PORTIS_ID,
    INFURA_ID: process.env.INFURA_ID,
  },

  publicRuntimeConfig: {
    INFURA_ID: process.env.INFURA_ID,
    PORTIS_ID: process.env.PORTIS_ID,
    TENDERLY_FORK_PATH: process.env.TENDERLY_FORK_PATH,
    TENDERLY_KEY: process.env.TENDERLY_KEY,
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/v-click-outside.js",
    // "~/plugins/web3modal.js",
    { src: '~/plugins/v-tooltip', mode: 'client' },
    { src: '~/plugins/v-clipboard2', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/composition-api/module',
    // Doc: https://github.com/nuxt-community/google-fonts-module
    "@nuxtjs/google-fonts",
    "@nuxtjs/svg",
  ],
  googleFonts: {
    families: {
      Montserrat: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
