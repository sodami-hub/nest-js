import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

/*
AuthGuard('local') 만 해도 LocalStrategy 의 validate() 가 호출되지만,
전략을 실행한 후 req.login() 및 serializeUser() 를 호출하여 세션에 사용자 정보를 저장하기 위해서 canActivate() 를 직접 작성한다.
*/
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    try {
      const can = await super.canActivate(context); // passport.authenticate('local') 를 호출하여 인증을 수행한다.
      if (can) {
        const request = context.switchToHttp().getRequest<Request>();
        await super.logIn(request); // passport.authenticate('local') 가 성공하면 request.login() -> serializeUser() 을 호출하여 세션에 사용자 정보를 저장한다.
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
    return true;
  }
}
