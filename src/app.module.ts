import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { config } from './config';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SeedModule } from './seed/seed.module';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  imports: [
    MongooseModule.forRoot(config.mongoUrl),

    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req, res) => {
          const existingID = req.id ?? req.headers['x-request-id'];
          if (existingID) {
            return existingID;
          }
          const id = randomUUID();
          res.setHeader('x-request-id', id);
          return id;
        },
        customAttributeKeys: {
          reqId: 'request-id',
        },
        customReceivedMessage: (req) =>
          `${req.method} ${req.url} HTTP/${req.httpVersion}`,
        customSuccessMessage: (req, res) =>
          `${req.method} ${req.url} HTTP/${req.httpVersion} ${res.statusCode}`,
        quietReqLogger: true,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                targets: [
                  {
                    target: 'pino-pretty',
                    options: {
                      colorize: true,
                    },
                  },
                  {
                    target: 'pino/file',
                    options: { destination: `${__dirname}/app.log` },
                  },
                ],
              }
            : undefined,
      },
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: config.redisHost,
      port: config.redisPort,
    }),
    ProductsModule,
    CategoriesModule,
    SuppliersModule,
    SeedModule,
  ],
})
export class AppModule {}
