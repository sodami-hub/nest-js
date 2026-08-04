import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { WsException } from '@nestjs/websockets';
import type { Request } from 'express';
import type { Socket } from 'socket.io';

interface SessionRequest {
  session?: SessionData;
}

interface SessionData {
  passport?: {
    user?: SessionUser;
  };
}

interface SessionUser {
  id: string;
}

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // HTTP 컨텍스트인지 웹 소켓 컨텍스트인지 확인
    const contextType = context.getType();

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      if (request.isAuthenticated()) {
        return true;
      }
      throw new ForbiddenException('로그인이 필요합니다.');
    } else if (contextType === 'ws') {
      const client = context.switchToWs().getClient<Socket>();

      // client.request.session.passport.user 가 존재하면 로그인한 것으로 친다. 존재하지 않으면 wsException 발생
      // client.request 는 웹소켓 client 객체에 존재하지만, client.request.session은 존재하지 않는다. 따라서 세션 미들웨어를 웹소켓 어댑터에 적용해야 한다.(socket-io.adapter.ts)
      const request = client.request as SessionRequest;
      if (request && request.session) {
        const session = request.session;
        if (session.passport && session.passport.user) {
          // 세션에 사용자 정보가 있으면 인증된 것으로 처리
          return true;
        }
      }
      // 인증되지 ㅇ낳은 경우 웹소켓 예외 발생
      throw new WsException('로그인이 필요합니다.');
    }
    throw new ForbiddenException('알 수 없는 컨텍스트입니다.');
  }
}
