/*
nest 는 기본적으로 404 에러를 NotFoundException으로 처리하므로 에러 처리 미들웨어만 따로 구현하면 된다.
*/
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // 인수가 없으므로 모든 예외 발생 시 catch 메서드가 실행 됨, app.module.ts 에 연결해서 모든 핸들러에 연결되도록 한다.
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof NotFoundException) {
      status = 404;
      message = `${req.method} ${req.url} 라우터가 없습니다.`;
    } else if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const response = exception.getResponse() as { message: string[] };
      message =
        'message' in response && Array.isArray(response.message)
          ? response.message.join(', ')
          : exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    res.locals.message = message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? exception : {};

    res.status(status).render('error');
  }
}
