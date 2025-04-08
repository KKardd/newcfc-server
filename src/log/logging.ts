import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

export function logging() {
  const nodeEnv = process.env.NODE_ENV || 'local';

  const format = ['development', 'test'].includes(nodeEnv)
    ? winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      )
    : winston.format.combine(winston.format.timestamp(), winston.format.ms(), winston.format.json());

  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format,
      }),
    ],
  });
}
