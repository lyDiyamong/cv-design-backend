module.exports = {
  apps: [
    {
      name: 'cv-design-backend', // Name of the application
      script: 'dist/main.js', // Path to the compiled main file
      instances: 'max', // Number of instances (use 'max' for all CPU cores)
      exec_mode: 'cluster', // Cluster mode for load balancing
      env: {
        NODE_ENV: 'development', // Development environment variables
      },
      env_production: {
        NODE_ENV: 'production', // Production environment variables
      },
    },
  ],
};
