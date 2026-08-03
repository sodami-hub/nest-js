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
  Inject,
  UseGuards,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LoggerInterceptor } from './logger/logger.interceptor';
import { TooManyRequestsException } from './http/too-many-requests.exception';
import { HttpFilter } from './http/http.filter';
import type { Response } from 'express';
import { User } from './auth/user.decorator';
import { IsNotLoggedInGuard } from './auth/is-not-logged-in.guard';
import { IsLoggedInGuard } from './auth/is-logged-in.guard';
import { posts, hashtags, postsToHashtags, users } from './drizzle/schema';
import * as schema from './drizzle/schema';
import { desc, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { RenderInterceptor } from './render/render.interceptor';
/*
nest의 컨트롤러
컨트롤러 + 라우터
@Get('주소') : 주소가 비어있으면 '/' 접속(핸들러 메서드) getHello()가 실행됨 
this.appService : src/app.service.ts의 AppService 클래스의 인스턴스 => 프로바이더라고 함
  - 프로바이더를 사용하려면 app.module.ts에서 providers에 등록
  - constructor(생성자) 에서도 AppService를 주입받아야 함
*/

@UseInterceptors(RenderInterceptor) // 인터셉터 사용시 @UseInterceptors() 데코레이터 사용
@Controller()
export class AppController implements OnModuleInit, OnApplicationBootstrap {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    @Inject('DRIZZLE')
    private readonly db: MySql2Database<typeof schema>,
  ) {
    console.log('AppController constructor');
  }
  onModuleInit() {
    console.log('AppController init');
  }
  onApplicationBootstrap() {
    console.log('AppController bootstrap');
  }

  @UseGuards(IsLoggedInGuard) // 로그인 상태에서만 접근 가능
  @Render('profile')
  @Get('profile')
  renderProfile() {
    return { title: '내 정보 - NodeBird' };
  }

  @UseGuards(IsNotLoggedInGuard) // 로그아웃 상태에서만 접근 가능
  @Render('join')
  @Get('join')
  renderJoin() {
    return { title: '회원가입 - NodeBird' };
  }

  @Render('main')
  @Get()
  async renderMain() {
    const twits = await this.db.query.posts.findMany({
      with: {
        user: {
          columns: {
            id: true,
            nick: true,
          },
        },
      },
      orderBy: [desc(posts.createdAt)],
    });
    return {
      title: 'NodeBird',
      twits,
    };
  }

  @Render('main')
  @Get('search')
  async renderSearch(@Res() res: Response, @Query('hashtag') query: string) {
    if (!query) {
      return res.redirect('/');
    }

    const result = await this.db
      .select({
        posts,
        user: {
          id: users.id,
          nick: users.nick,
        },
      })
      .from(posts)
      .innerJoin(postsToHashtags, eq(posts.id, postsToHashtags.postId))
      .innerJoin(hashtags, eq(hashtags.id, postsToHashtags.hashtagId))
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(hashtags.title, query))
      .orderBy(desc(posts.createdAt));

    return {
      title: `${query} | NodeBird`,
      twits: result.map((row) => ({ ...row.posts, user: row.user })),
    };
  }

  @Get('hello')
  // @UseFilters(HttpFilter) // 필터 사용시 @UseFilters() 데코레이터 사용
  // @UseInterceptors(LoggerInterceptor) // 인터셉터 사용시 @UseInterceptors() 데코레이터 사용
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

  /*
  커스텀 매개변수 데코레이터 @User() 사용 예시
  @User() user: Express.User | undefined : @User() 데코레이터를 사용하여 Express.User 타입의 user 객체를 주입받음
  @User('id') userId: string | undefined : @User('id') 데코레이터를 사용하여 user 객체에서 id 속성만 주입받음

  이런 방법을 사용하는 이유. @Req() req 를 통해서 req.user를 직접 접근하는 것보다,
  @User() 데코레이터를 사용하여 필요한 속성만 주입받는 것이 더 깔끔하고, 테스트하기도 용이함
  기능적으로도 @Res() res 를 사용하게 되면 res 를 객체를 사용해서 반환해야되는 불편함이 있지만
  이렇게 @User() 데코레이터를 사용하면 필요한 속성만 주입받아서 반환할 수 있음
  */
  @Get('user')
  getUser(@User() user: Express.User | undefined) {
    return user;
  }
}
