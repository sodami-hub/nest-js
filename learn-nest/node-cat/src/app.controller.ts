import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
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

  @Get()
  getHello(): string {
    console.log('PORT:', this.configService.get('PORT'));
    console.log('COOKIE_SECRET:', this.configService.get('COOKIE_SECRET'));
    console.log('KAKAO_ID:', process.env.KAKAO_ID);
    return this.appService.getHello();
  }
}
