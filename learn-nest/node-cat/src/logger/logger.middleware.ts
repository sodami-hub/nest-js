import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
/*
$ nest g mi logger
- 네스트의 미들웨어도 프로바이더(@Injectable())로 등록됨.
- NestMiddleware 인터페이스를 구현해야 함. use() 메서드를 구현해야 함.
*/
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method} ${req.originalUrl}]`);
    next();
  }
}
