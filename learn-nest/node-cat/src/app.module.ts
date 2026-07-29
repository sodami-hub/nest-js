import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthController } from './auth/auth.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DrizzleModule } from './drizzle/drizzle.module';
import path from 'node:path';
import * as schema from './drizzle/schema';
import * as relations from './drizzle/relations';

/* ConfigModule.forRoot() : 환경변수 설정을 위해 ConfigModule을 import 한다. .env 파일에 있는 환경변수를 process.env 객체에 넣어준다.
- 따라서 package.json 에 추가된 --env-file .env는 모두 지워도 된다.
- ConfigModule을 연결하면 AppController, AppService의 constructor에서 ConfigService를 통해 .env 파일에 있는 환경변수를 가져올 수 있다.
*/
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }), // ConfigModule.forRoot({isGlobal: true}) : ConfigModule을 전역 모듈로 설정하여 다른 모듈에서 import 없이 ConfigService를 사용할 수 있도록 한다.
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'), // public 폴더를 정적 파일 제공 경로로 설정한다.
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'), // uploads 폴더를 정적 파일 제공 경로로 설정한다.
      serveRoot: '/img', // /img 경로로 접근하면 img 폴더의 파일을 제공한다.
    }),
    DrizzleModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          mysql: {
            user: 'root',
            password: configService.get<string>('DB_PASSWORD'),
            host: 'localhost',
            port: 3306,
            database: 'nodebird',
            connectionLimit: 10,
          },
          config: {
            logger: true,
            schema: { ...schema, ...relations },
            mode: 'default',
          },
        };
      },
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 모든 라우터에 대해 LoggerMiddleware를 적용한다. /auth와 그 하위 라우터에만 적용하고 싶으면 forRoutes('auth')로 변경하면 된다.
    // forRoutes({path: 'auth{*wildcard}', method: RequestMethod.ALL}) : 와일드 카드를 적용할 수 있으며, method도 지정할 수 있다.
    // forRoutes(AuthController) : 특정 컨트롤러에만 적용할 수도 있다.
    consumer
      .apply(LoggerMiddleware)
      .exclude('auth/kakao', { path: 'auth/login', method: RequestMethod.POST }) // exclude는 forRoutes와 다르게 정확하게 일치하는 라우터만 제거한다.
      .forRoutes(AuthController);
  }
}
