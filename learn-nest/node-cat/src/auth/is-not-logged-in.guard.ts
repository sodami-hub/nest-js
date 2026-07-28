import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';

/*
guard : 가드 생성
$ nest g gu is-not-logged-in 
$ nest g gu is-logged-in

- 케밥케이스를 사용한다.
- @Injectable() 이 붙어있는 것으로 볼때 프로바이더(서비스)로 등록이 된다.
- implements CanActivate 를 통해서 CanActivate 인터페이스를 구현해야 된다.
- 아래 IsNotLoggedInGuard 클래스도 canActivate() 메서드를 가지고 있다.
- 가드에서는 canActivate() 메서드가 가장 중요하다. 해당 메서드의 반환값이 true이면 해당 라우터를 사용할 수 있고, false이거나 에러를 throw하면 사용할 수 없다.
*/

@Injectable()
export class IsNotLoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.isAuthenticated()) {
      return true;
    }
    throw new ForbiddenException('로그인한 상태입니다.');
  }
}
