import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

/* ConfigModule.forRoot() : 환경변수 설정을 위해 ConfigModule을 import 한다. .env 파일에 있는 환경변수를 process.env 객체에 넣어준다.
- 따라서 package.json 에 추가된 --env-file .env는 모두 지워도 된다.
- ConfigModule을 연결하면 AppController, AppService의 constructor에서 ConfigService를 통해 .env 파일에 있는 환경변수를 가져올 수 있다.
*/
@Module({
  imports: [AuthModule, ConfigModule.forRoot({isGlobal: true})], // ConfigModule.forRoot({isGlobal: true}) : ConfigModule을 전역 모듈로 설정하여 다른 모듈에서 import 없이 ConfigService를 사용할 수 있도록 한다.
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
