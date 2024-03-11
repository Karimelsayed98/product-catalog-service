import 'dotenv/config';

const fromEnv = (name: string, defaultValue?: string) => {
  const value = process.env[name] || defaultValue;

  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }

  return value;
};

export const config = {
  mongoUrl: fromEnv('MONGO_URL'),
  redisHost: fromEnv('REDIS_HOST'),
  redisPort: parseInt(fromEnv('REDIS_PORT'), 10),
};
