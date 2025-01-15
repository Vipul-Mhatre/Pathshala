const validateEnv = () => {
  const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'SCHOOL1_EMAIL',
    'SCHOOL1_PASSWORD',
    'SCHOOL2_EMAIL',
    'SCHOOL2_PASSWORD',
    'SCHOOL3_EMAIL',
    'SCHOOL3_PASSWORD',
    'SUPERUSER1_USERNAME',
    'SUPERUSER1_EMAIL',
    'SUPERUSER1_PASSWORD',
    'SUPERUSER2_USERNAME',
    'SUPERUSER2_EMAIL',
    'SUPERUSER2_PASSWORD'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

module.exports = validateEnv; 