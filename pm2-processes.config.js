module.exports = {
  apps: [
    {
      name: 'vendori',
      script: './dist/src/main.js',
      watch: false,
      instances: 5,
      exec_mode: 'cluster',
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_demo: {
        NODE_ENV: 'demo',
      },
      env_clean: {
        NODE_ENV: 'clean',
      },
    },
  ],
};
