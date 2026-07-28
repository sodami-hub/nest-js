import { Injectable } from '@nestjs/common';
/*
프로바이더 클래스
@Injectable() : 이 클래스가 프로바이더임을 나타냄. 다른 컨트롤러나 프로바이더에서 사용할 수 있다.
*/
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
