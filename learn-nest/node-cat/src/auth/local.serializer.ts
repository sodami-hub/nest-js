import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../drizzle/schema';
import { eq, getTableColumns } from 'drizzle-orm';
/*
LocalSerializer 클래스는 PassportSerializer를 상속받는다.
 - 생성자 함수에서 super() 를 호출하여 부모 클래스의 생성자를 호출한다.
 - serializeUser(), deserializeUser() 를 반드시 구현해야 한다.
*/
@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    // 클래스의 경우에는 @Inject('프로바이더이름') 없어도 의존성을 주입할 수 있다. 그러나 { provide: '이름' } 형태로 만든 프로바이더는 반드시 @Inject('이름') 데코레이터를 사용해야 한다.
    @Inject('DRIZZLE') // 생성자 매개변수 위에 @Inject('DRIZZLE') 데코레이터를 사용하여 DrizzleModule에서 제공하는 MySql2Database 인스턴스를 주입받는다.
    private readonly db: MySql2Database<typeof schema>,
  ) {
    super();
  }

  serializeUser(user: { id: string }, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(id: string, done: CallableFunction) {
    try {
      const { password, ...rest } = getTableColumns(schema.users); // users 테이블에서 password 컬럼을 제외한 나머지 컬럼들을 rest 객체로 가져온다. (password 컬럼은 보안상 제외)
      const user = await this.db
        .select({
          ...rest, // users 테이블에서 password 컬럼을 제외한 나머지 컬럼들을 조회한다.
        })
        .from(schema.users)
        .where(eq(schema.users.id, id));
      done(null, user[0]);
    } catch (error) {
      console.error(error);
      done(error);
    }
  }
}
