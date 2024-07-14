import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { config } from './@core/config';
import { GlobalLoggerModule } from './@core/logging/GlobalLogger.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
      serveStaticOptions: {
        dotfiles: 'allow',
      },
    }),
    EventEmitterModule.forRoot(),
    GlobalLoggerModule,
    JwtModule.register({
      global: true,
    }),
    ApiModule,
  ],
})
export class AppModule {}
