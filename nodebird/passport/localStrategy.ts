import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from '../drizzle/connection.ts';
import { eq } from 'drizzle-orm';
import { users } from '../drizzle/schema.ts';

/*
- usernameField : 사용자 인증에 사용할 필드명, passwordField : 비밀번호 인증에 사용할 필드명
    -> 로그인시 전달받은 id,pw를 받는 키를 usernameField, passwordField에 매핑한다.
- passReqToCallback : true로 설정하면 req 객체를 콜백으로 전달한다. false면 전달하지 않는다.
즉, true 인경우 async (req, id, password, done) => { ... } 형태로 콜백함수를 작성해야 한다.
- done : LocalStrategy 전략의 로그인 결과를 Passport에게 전달하는 콜백함수로서, 그 결과가 controller/auth.ts의 login() 컨트롤러의
passport.authenticate('local', callback()) 미들웨어의 콜백함수로 전달된다. done() 함수는 3개의 인자를 받는다.
*/
export default () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: false, // req 객체를 콜백으로 전달
            },
            async (email, password, done) => {
                try {
                    const exUser = await db
                        .select()
                        .from(users)
                        .where(eq(users.id, email))
                        .limit(1);
                    if (exUser.length) {
                        const result = await bcrypt.compare(password, exUser[0]?.password ?? '');
                        if (result) {
                            done(null, exUser[0], undefined); // 로그인 성공
                        } else {
                            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                        }
                    } else {
                        done(null, false, { message: '가입되지 않은 회원입니다.' });
                    }
                } catch (error) {
                    console.error(error);
                    done(error, false, undefined);
                }
            },
        ),
    );
};
