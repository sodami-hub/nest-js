import passport from 'passport';
import local from './localStrategy.ts'; // 로컬 로그인 처리
import kakao from './kakaoStrategy.ts'; // 카카오 로그인 처리
import db from '../drizzle/connection.ts';
import { eq, getTableColumns } from 'drizzle-orm';
import { users } from '../drizzle/schema.ts';

export default () => {
    /*
        * serializeUser : 로그인 시 사용자 정보를 세션에 저장
            - 첫 번째 매개변수 user는 로그인 성공 시 전달되는 사용자 정보, 두 번째 매개변수 done은 콜백 함수
            - done(에러가 발생할 때 사용, 세션에 저장할 사용자 정보)
            - 로그인할 때만 호출 됨(controller/auth.ts 의 50번째 줄 req.login(user, callback()) 호출 시)
    */
    passport.serializeUser((user, done) => {
        done(null, (user as { id: string }).id);
    });

    /*
        * deserializeUser : 매 요청 시 세션에 저장된 사용자 정보를 불러옴
            - 첫 번째 매개변수 id는 serializeUser에서 세션에 저장한 사용자 정보, 두 번째 매개변수 done은 콜백 함수
            - done(에러가 발생할 때 사용, req.user에 저장할 사용자 정보) -> req.user 를 통해 로그인한 사용자의 정보를 가져올 수 있다.
            - 로그인 후 모든 요청에서 호출 됨
    */
    passport.deserializeUser(async (id: string, done) => {
        try {
            const { password, ...rest } = getTableColumns(users);
            const user = await db
                .select({
                    ...rest,
                })
                .from(users)
                .where(eq(users.id, id));
            done(null, user[0]);
        } catch (err) {
            console.error(err);
            done(err);
        }
    });

    local();
    kakao();
};
