import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, type Socket, type ExtendedError } from 'socket.io';
import type { NextFunction, RequestHandler, Request, Response } from 'express';
import type { INestApplicationContext } from '@nestjs/common';
/*
client.request 안에 session 객체를 주입하는 과정(소켓 연결 시점에 세션 미들웨어를 적용) 
main.ts에 장착!
*/
export class SessionSocketIoAdapter extends IoAdapter {
  private sessionMiddleware: RequestHandler;

  constructor(app: INestApplicationContext, sessionMiddleware: RequestHandler) {
    super(app);
    this.sessionMiddleware = sessionMiddleware;
  }

  create(port: number, options?: ServerOptions) {
    const server = super.create(port, options);

    // Socket.IO에 세션 미들웨어 적용
    server.use((socket: Socket, next: (err?: ExtendedError) => void) => {
      // cast next to express NextFunction for the session middleware
      this.sessionMiddleware(
        socket.request as Request,
        {} as Response,
        next as unknown as NextFunction,
      );
    });

    return server;
  }
}
