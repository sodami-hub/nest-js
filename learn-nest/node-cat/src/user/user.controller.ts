import { Controller, Post, Param, Inject, UseGuards } from '@nestjs/common';
import { users, follows } from '../drizzle/schema';
import * as schema from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { IsLoggedInGuard } from '../auth/is-logged-in.guard';
import { User } from '../auth/user.decorator';

@Controller('user')
export class UserController {
  constructor(
    @Inject('DRIZZLE')
    private readonly db: MySql2Database<typeof schema>,
  ) {}

  @UseGuards(IsLoggedInGuard)
  @Post(':id/follow')
  async followUser(@Param('id') id: string, @User() user: Express.User) {
    const following = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (!following.length) {
      throw new Error('존재하지 않는 회원입니다.');
    }
    await this.db.insert(follows).values({
      followerId: user.id,
      followingId: id,
    });
    return 'success';
  }
}
