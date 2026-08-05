import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import nunjucks from 'nunjucks';
import { AppModule } from './app.module';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { SessionSocketIoAdapter } from './auth/socket-io.adapter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useGlobalPipes(new ValidationPipe({ transform: true })); // ✨파이프 전역으로 등록하기, 반드시 new를 사용해서 인스턴스화해야 된다.

  const express = app.getHttpAdapter().getInstance();
  const views = join(__dirname, '..', 'views');
  nunjucks.configure(views, { express: express, watch: true });
  app.setViewEngine('html');
  app.setBaseViewsDir(views);

  app.use(morgan('dev'));
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // 익스프레스 세션 미들웨어를 익스프레스와 웹 소켓 모두에서 사용할 수 있도록 설정
  const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  });
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  // Socket.IO 어뎁터 설정 - 세션 공유를 위함
  app.useWebSocketAdapter(new SessionSocketIoAdapter(app, sessionMiddleware));

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT ?? 3000}`,
    );
  });
}

bootstrap();
