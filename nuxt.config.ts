// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
        configPath: 'tailwind.config',
        exposeConfig: false,
        exposeLevel: 2,
        injectPosition: 'first',
        viewer: true,
    },
    modules: [
        '@nuxtjs/tailwindcss', '@pinia/nuxt'
    ]
})
