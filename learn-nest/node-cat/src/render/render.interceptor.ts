import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

/*
nodebird의 routes/page.js 아래 코드 부분 로그인한 회원의 팔로워, 팔로잉 수를 locals에 저장하는 부분
router.use((req, res, next) => {
    
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.followers?.length ?? 0;
    res.locals.followingCount = req.user?.followings?.length ?? 0;
    res.locals.followingIdList = req.user?.followings?.map(f => f.following.id) ?? [];
    next();
});

이 부분을 네스트에서 어떻게 처리할 수 있을까? 컨트롤러가 실행되기 전에 적용되어야 한다.
따라서 인터셉터를 사용하면 된다. 인터셉터는 컨트롤러가 실행되기 전에 실행되므로,
req.user를 locals에 저장하는 작업을 인터셉터에서 처리할 수 있다.

$ nest g itc render
*/

@Injectable()
export class RenderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.followers?.length ?? 0;
    res.locals.followingCount = req.user?.followings?.length ?? 0;
    res.locals.followingIdList =
      req.user?.followings?.map((f) => f.following.id) ?? [];
    return next.handle();
  }
}
