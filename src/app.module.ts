import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, ValidationPipe } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { MongoDriver } from '@mikro-orm/mongodb';
import { APP_PIPE } from '@nestjs/core';

import { config } from './config';
import { ProductModule } from './product/product.module';

@Module({
  providers: [{
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },],
  imports: [MikroOrmModule.forRoot({
    autoLoadEntities: true,
    driver: MongoDriver,
    clientUrl: config.mongoUrl,
  }),
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
      customReceivedMessage: (req) => `${req.method} ${req.url} HTTP/${req.httpVersion}`,
      customSuccessMessage: (req, res) => `${req.method} ${req.url} HTTP/${req.httpVersion} ${res.statusCode}`,
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
  ProductModule,],
})
export class AppModule {}
