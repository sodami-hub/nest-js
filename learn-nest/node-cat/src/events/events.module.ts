import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { LoggingService } from './logging.service';
import { AnalyticsService } from './analytic.service';

/* ✨ 이벤트
다른 서비스의 메서드를 호출할 때 의존성 주입을 통해서 호출했다.
이벤트를 사용하면 의존성 주입 없이 다른 서비스의 메서드를 호출할 수 있다.

$ npm i @nestjs/event-emitter
이벤트는 @OnEvent() 데코레이터로 등록할 수 있다. 해당 이름의 이벤트가 호출되면 메서드가 실행된다.
세 서비스 모두 user.created, post.created 이벤트를 갖고 있다. user.created 이벤트가 발생하면 NotificationService, LoggingService, AnalyticsService의 handleUserCreated 메서드가 실행된다.
🪧 참고로 이벤트를 등록할 때 와일드카드 이름을 사용할 수 있다. app.module.ts 에 EventEmitterModule.forRoot 의 옵션에 wildcard: true 를 넣어야 된다.
예를들어 @OnEvent('user.*')라고 하면 * 표시는 어떤 문자열이든 가능하다는 의미이다. 다만 .이 구분자여서 user.created.once 같은 이벤트는 해당이 안된다. user.*.* 형태로 해야 된다.
하지만 user.** 을 사용하면 구분자와 무관하게 모든 문자열을 처리할 수 있다.
✨ 이벤트를 사용하는 이유 : 기존 서비스와 긴밀하게 관련되지 않은 작업을 수행할 때 사용한다. 예를 들어, 회원가입에 대해서 이벤트로 등록된 서비스는 실패하더라도 회원가입 자체에는 영향을 주지 않는다.
따라서 이벤트를 사용하면 서비스 간의 결합도를 낮출 수 있다.
*/

@Module({
  providers: [NotificationService, LoggingService, AnalyticsService], // 각각 이벤트리스너라고 생각하면 될 듯
  exports: [NotificationService, LoggingService, AnalyticsService],
})
export class EventsModule {} // 이벤트를 관리할 모듈
