import * as process from 'process';

import { registerAs } from '@nestjs/config';

export default registerAs('common', () => {
  const environment = process.env.ENVIRONMENT || 'local'; // development, dev, staging, prod
  const nodeEnv = process.env.NODE_ENV || 'development'; // development, test, production

  if (environment === 'local' && nodeEnv === 'production') {
    throw new Error('Invalid configuration: NODE_ENV cannot be production when ENVIRONMENT is local');
  }

  return {
    environment,
    nodeEnv,
    httpPort: parseInt(process.env.HTTP_PORT || '8000'),
    cors: {
      // e.g. http://localhost:3000,http://localhost:3001
      allowedOrigins:
        process.env.CORS_ALLOWED_ORIGINS && process.env.CORS_ALLOWED_ORIGINS.trim() !== ''
          ? process.env.CORS_ALLOWED_ORIGINS.split(',')
          : '*',
    },
    sentryDsn: process.env.SENTRY_DSN,
  };
});
