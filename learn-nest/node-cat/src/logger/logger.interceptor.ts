import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request, Response } from 'express';
/*
$ nest g itc logger // logger 인터셉터 추가
*/

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    console.log(`Before... ${method} ${originalUrl} - ${userAgent} ${ip}`);

    const start = Date.now();

    /* 핸들러를 호출하는 부분 - 이전에 코드를 넣으면 해당 핸들러가 호출되기 전에 실행됨
      nest.handle()이 반환하는 Observable은 비동기 함수형 프로그래밍 라이브라러인 rxjs에서 사용하는 객체이다.
      👍rxjs는 따로 공부하면 좋다. 간단한 활용법을 보겠다. pipe 라는 메서드가 있어 핸들러 수행 후 다음 동작을 진행할 수 있다.
    */
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const { statusCode } = response;
        const contentLength = response.get('content-length');
        const time = Date.now() - start;
        console.log(`After... ${statusCode} ${contentLength} - ${time}ms`);
      }),
    );
  }
}
