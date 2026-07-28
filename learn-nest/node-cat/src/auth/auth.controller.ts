import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsLoggedInGuard } from './is-logged-in.guard';
import { IsNotLoggedInGuard } from './is-not-logged-in.guard';

// 내부에 선언하는 라우터 주소 앞에 모두 '/auth' 를 붙인다.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/join
  @UseGuards(IsNotLoggedInGuard)
  @Post('join')
  join() {}

  // POST /auth/login
  @UseGuards(IsNotLoggedInGuard)
  @Post('lgoin')
  login() {}

  // GET /auth/logout
  @UseGuards(IsLoggedInGuard)
  @Get('logout')
  logout() {}

  // GET /auth/kakao
  @UseGuards(IsNotLoggedInGuard)
  @Get('kakao')
  kakao() {}

  // GET /auth/kakao/callback
  @UseGuards(IsNotLoggedInGuard)
  @Get('kakao/callback')
  kakaoCallback() {}
}
