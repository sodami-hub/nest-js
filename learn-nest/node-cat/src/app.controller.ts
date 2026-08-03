import {
  Controller,
  Get,
  UseInterceptors,
  OnModuleInit,
  OnApplicationBootstrap,
  InternalServerErrorException,
  UseFilters,
  Res,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LoggerInterceptor } from './logger/logger.interceptor';
import { TooManyRequestsException } from './http/too-many-requests.exception';
import { HttpFilter } from './http/http.filter';
import type { Response } from 'express';
/*
nest의 컨트롤러
컨트롤러 + 라우터
@Get('주소') : 주소가 비어있으면 '/' 접속(핸들러 메서드) getHello()가 실행됨 
this.appService : src/app.service.ts의 AppService 클래스의 인스턴스 => 프로바이더라고 함
  - 프로바이더를 사용하려면 app.module.ts에서 providers에 등록
  - constructor(생성자) 에서도 AppService를 주입받아야 함
*/

@Controller()
export class AppController implements OnModuleInit, OnApplicationBootstrap {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}
  onModuleInit() {
    console.log('AppController init');
  }
  onApplicationBootstrap() {
    console.log('AppController bootstrap');
  }

  // @UseInterceptors(LoggerInterceptor)

  @Get()
  // @UseFilters(HttpFilter) // 필터 사용시 @UseFilters() 데코레이터 사용
  //@UseInterceptors(LoggerInterceptor) // 인터셉터 사용시 @UseInterceptors() 데코레이터 사용
  /*
  @Res() : express의 Response 객체를 주입받음
  @Query() : 쿼리스트링을 주입받음 
  @Query('age') age: string : 쿼리스트링에서 age만 주입받음
  
  */
  getHello(@Res() res: Response, @Query() query: Record<string, string>) {
    console.log(
      'from ConfigService Module:',
      this.configService.get('VIEW_CONFIG_SERVICE'),
    );
    console.log('from .env file:', process.env.VIEW_ENV_SERVICE);
    console.log(`query: ${JSON.stringify(query, null, 2)}`);
    return res.status(200).json(query); // ⚠️@Res() 때문에 nestjs가 자동으로 응답을 처리하지 않음. 따라서 res.status(200).json()으로 직접 응답 처리
    // return this.appService.getHello(res);
  }
}
