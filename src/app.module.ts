import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
import databaseConfig from '../config/database.config';
import jwtConfig from '../config/jwt.config';

import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule
} from 'nestjs-i18n';
import * as path from 'path';
import { configValidationSchema } from '../config/validation/validation-config';
import { DbExceptionFilter } from './exceptions/db-exception.filter';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
// import { I18nExceptionFilter } from './exceptions/i18n-exception.filter';
import { AppController } from './app.controller';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { UtilsModule } from './utils/ultils.module';
import { V1Module } from './v1/v1.module';
import { CronService } from './cron/cron.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    V1Module,
    UtilsModule,
    //Config
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
      cache: true,
      load: [jwtConfig, databaseConfig],
    }),

    //Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    //Cache
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    //Language
    I18nModule.forRoot({
      fallbackLanguage: 'kr',
      loaderOptions: {
        path: path.join(__dirname, '..', '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: HeaderResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    // { provide: APP_FILTER, useClass: I18nExceptionFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: DbExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    CronService,
  ],
})
export class AppModule {}
