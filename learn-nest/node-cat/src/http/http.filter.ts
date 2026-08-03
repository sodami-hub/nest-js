import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { TooManyRequestsException } from './too-many-requests.exception';
import { response, type Response } from 'express';

/*
(http)filter 생성
$ nest g f http 
*/

@Catch() // Catch() 데코레이터에 인수가 없는 경우 모든 예외 발생 시 catch() 메서드를 실행하겠다는 뜻
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    //TooManyRequestsException 예외 발생 시
    if (exception instanceof TooManyRequestsException) {
      const response = host.switchToHttp().getResponse<Response>();
      return response.status(429).json({
        code: 4118,
        msg: '요청이 너무 많습니다.',
      });
    }
    return response.status(exception.getStatus()).json({
      code: exception.getStatus(),
      msg: exception.message || 'Internal Server Error',
    });
  }
}
