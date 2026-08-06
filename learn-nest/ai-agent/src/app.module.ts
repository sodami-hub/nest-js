import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration], // ConfigModule이 .env 파일을 그대로 읽는 것이 아니라, load 옵션은 설정 팩토리 함수를 실행해, 환경변수(process.env)를 애플리케이션용 설정 객체로 변환하고 등록한다.
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
