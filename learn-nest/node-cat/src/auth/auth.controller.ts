import {
  Controller,
  Get,
  Post,
  UseGuards,
  OnModuleInit,
  OnApplicationBootstrap,
  UsePipes,
  ValidationPipe,
  Redirect,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsLoggedInGuard } from './is-logged-in.guard';
import { IsNotLoggedInGuard } from './is-not-logged-in.guard';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JoinDto } from './dto/join.dto';
import type { Request, Response } from 'express';

// 내부에 선언하는 라우터 주소 앞에 모두 '/auth' 를 붙인다.
@Controller('auth')
export class AuthController implements OnModuleInit, OnApplicationBootstrap {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // AppModule에만 ConfigModule을 연결했으므로 AuthModule에 연결된 AuthController에서 ConfigService를 사용하면 에러가 발생한다.
    /* ⚠️⚠️네스트를 사용할 때 가장 많이 볼 에러 메시지 : ConfigService를 AuthController에서 사용할 수 없다는 의미. ConfigService를 AuthModule에 providers로 연결해야 된다. 또는 AuthModule에 ConfigModule을 import 해야 된다.
    [Nest] 21247  - 07/28/2026, 4:57:27 PM   ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the AuthController (AuthService, ?). Please make sure that the argument ConfigService at index [1] is available in the AuthModule module.

      Potential solutions:
      - Is AuthModule a valid NestJS module?
      - If ConfigService is a provider, is it part of the current AuthModule?
      - If ConfigService is exported from a separate @Module, is that module imported within AuthModule?
        @Module({
          imports: [ /* the Module containing ConfigService 
    */
  ) {}
  onModuleInit() {
    console.log('AuthController init.');
  }
  onApplicationBootstrap() {
    console.log('AuthController bootstrapped.');
  }

  // POST /auth/join
  @UseGuards(IsNotLoggedInGuard)
  @UsePipes(ValidationPipe) // DTO에 정의된 유효성 검증을 수행한다.
  @Redirect('/') // 회원가입 성공 시 메인 페이지로 리다이렉트한다.
  @Post('join')
  async join(@Body() body: JoinDto) {
    try {
      await this.authService.join(body);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === '이미 존재하는 사용자입니다.'
      ) {
        return { url: '/join?error=exist' }; // 회원가입 실패 시 join 페이지로 리다이렉트한다.
      }
      return {
        url: `/join?error=${error instanceof Error ? error.message : String(error)}`,
      }; // 회원가입 실패 시 join 페이지로 리다이렉트한다.
    }
  }

  // POST /auth/login
  @UseGuards(IsNotLoggedInGuard, LocalAuthGuard) // LocalAuthGuard를 사용하여 로그인 요청을 처리한다.
  @Redirect('/') // 로그인 성공 시 메인 페이지로 리다이렉트한다.
  @Post('login')
  login() {}

  // GET /auth/logout
  @UseGuards(IsLoggedInGuard)
  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout(() => {
      res.redirect('/');
    });
  }

  // GET /auth/kakao
  @UseGuards(AuthGuard('kakao')) // passport.authenticate('kakao') 를 호출하여 카카오 로그인 요청을 처리한다.
  @Get('kakao')
  kakao() {}

  // GET /auth/kakao/callback
  @UseGuards(AuthGuard('kakao'))
  @Get('kakao/callback')
  @Redirect('/') // 카카오 로그인 성공 시 메인 페이지로 리다이렉트한다.
  kakaoCallback() {}
}
