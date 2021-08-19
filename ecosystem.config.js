module.exports = {
  apps: [
    {
      name: 'assembly',
      exec_mode: 'cluster',
      instances: 'max', 
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        HOST: 'localhost',
	PORT: 4000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '4000',
	HOST: 'localhost'
      },
    },
  ],
}
