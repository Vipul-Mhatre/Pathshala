const validateEnv = () => {
  const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'SUPERUSER1_USERNAME',
    'SUPERUSER1_EMAIL',
    'SUPERUSER1_PASSWORD',
    'SUPERUSER2_USERNAME',
    'SUPERUSER2_EMAIL',
    'SUPERUSER2_PASSWORD'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
};

module.exports = validateEnv; 