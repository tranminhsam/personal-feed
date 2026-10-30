// PM2 Configuration for VPS / Production Servers
module.exports = {
  apps: [
    {
      name: 'personal-dashboard',
      script: 'server/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
