import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { RequestSubscriber } from '@/port/audit/request.subscriber';

export function TypeOrmConfig(configService: ConfigService, dbName?: string): TypeOrmModuleOptions {
  const nodeEnv = configService.get<string>('NODE_ENV');

  const defaultOptions: TypeOrmModuleOptions = dbName
    ? {
        type: 'postgres',
        host: configService.get<string>(`DB_HOST_${dbName}`),
        port: parseInt(configService.get<string>(`DB_PORT_${dbName}`) || '5432'),
        username: configService.get<string>(`DB_USERNAME_${dbName}`),
        password: configService.get<string>(`DB_PASSWORD_${dbName}`),
        database: configService.get<string>(`DB_NAME_${dbName}`),
        schema: configService.get<string>(`DB_SCHEMA_${dbName}`),
        entities: [__dirname + '/../domain/**/*.entity{.ts,.js}'],
        subscribers: [RequestSubscriber],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        logging: true,
        retryAttempts: 3,
        retryDelay: 3000,
        useUTC: true,
      }
    : {
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        schema: configService.get<string>('DB_SCHEMA'),
        entities: [__dirname + '/../domain/**/*.entity{.ts,.js}'],
        subscribers: [RequestSubscriber],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: nodeEnv !== 'production',
        logging: true,
        retryAttempts: 3,
        retryDelay: 3000,
        useUTC: true,
      };

  const testOptions: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: `:memory:`,
    entities: [__dirname + '/../domain/**/*.entity{.ts,.js}'],
    subscribers: [RequestSubscriber],
    synchronize: true,
    logging: true,
    autoLoadEntities: true,
    retryAttempts: 3,
    retryDelay: 3000,
  };

  const typeOrmModuleOption = nodeEnv === 'test' ? testOptions : defaultOptions;

  return typeOrmModuleOption;
}
