import { Injectable, Inject } from '@nestjs/common';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../drizzle/schema';
import { JoinDto } from './dto/join.dto';

/*
컨트롤러와 서비스의 분리
- 서비스에서 Request, Response 객체를 직접 다루지 않는다.
- 서비스는 비즈니스 로직만 처리한다.
- 컨트롤러는 요청과 응답을 처리한다. 요청에서 필요한 데이터를 서비스에 전달하고, 서비스에서 처리한 결과를 응답으로 반환한다.
*/
@Injectable()
export class AuthService {
  constructor(
    @Inject('DRIZZLE') private readonly db: MySql2Database<typeof schema>,
  ) {}

  async join(joinDto: JoinDto) {
    const { id, nick, password } = joinDto;
    const exUser = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (exUser.length) {
      throw new Error('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.db.insert(users).values({ id, nick, password: hashedPassword });
  }
}
