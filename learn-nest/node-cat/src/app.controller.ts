import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LoggerInterceptor } from './logger/logger.interceptor';
/*
nest의 컨트롤러
컨트롤러 + 라우터
@Get('주소') : 주소가 비어있으면 '/' 접속(핸들러 메서드) getHello()가 실행됨 
this.appService : src/app.service.ts의 AppService 클래스의 인스턴스 => 프로바이더라고 함
  - 프로바이더를 사용하려면 app.module.ts에서 providers에 등록
  - constructor(생성자) 에서도 AppService를 주입받아야 함
*/

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @UseInterceptors(LoggerInterceptor)
  @Get()
  getHello(): string {
    console.log(
      'from ConfigService Module:',
      this.configService.get('VIEW_CONFIG_SERVICE'),
    );
    console.log('from .env file:', process.env.VIEW_ENV_SERVICE);
    return this.appService.getHello();
  }
}
