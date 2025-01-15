const validateEnv = () => {
  const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'SUPERUSER1_USERNAME', 'SUPERUSER1_EMAIL', 'SUPERUSER1_PASSWORD', 'SUPERUSER2_USERNAME', 'SUPERUSER2_EMAIL', 'SUPERUSER2_PASSWORD'];

  requiredEnvVars.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Missing environment variable: ${variable}`);
    }
  });
};

module.exports = validateEnv; 