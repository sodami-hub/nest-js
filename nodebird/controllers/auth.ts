import bcrypt from 'bcrypt';
import passport from 'passport';
import db from '../drizzle/connection.ts';
import { eq } from 'drizzle-orm';
import { users } from '../drizzle/schema.ts';
import type { Request, Response, NextFunction } from 'express';
import type { MessageType as msgType } from '../types/type.ts';
import type { MyError } from '../types/type.ts';

export const join = async (req: Request, res: Response, next: NextFunction) => {
    const { id, nick, password } = req.body;
    try {
        const exUser = await db.select().from(users).where(eq(users.id, id)).limit(1);

        if (exUser.length) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); // Rounds of hashing, 12 이상 추천, 최대 31
        await db.insert(users).values({
            id,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

/* 로그인 컨트롤러
로그인 요청이 들어오면 passport.authenticate('local') 미들웨어가 로컬 로그인 전략을 수행하고,
인증 결과에 따라 콜백 함수를 호출한다.
*/
export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
        'local',
        (authError: MyError | null, user: Express.User | false, info: msgType | undefined) => {
            if (authError) {
                console.error(authError);
                return next(authError);
            }
            if (!user) {
                const msg = typeof info === 'string' ? info : info?.message;
                return res.redirect(`/?loginError=${msg}`);
            }
            /*
        Passport 는 req 객체에 login(), logout(), isAuthenticated(), isUnauthenticated() 메서드를 추가한다. 
            - req.login() 메서드는 passport.serializeUser()를 호출하여 사용자 정보를 세션에 저장한다.
            - req.login() 의 두번째 매개변수인 콜백함수는 serializeUser와 세션 저장까지 완료된 후 호출되는 콜백이다.
        */
            return req.login(user, (loginError: MyError | null) => {
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }
                return res.redirect('/');
            });
        },
    )(req, res, next); // 미들웨어 내부의 미들웨어에는 (req, res, next)를 붙입니다.(인수로 전달)
};

export const logout = (req: Request, res: Response) => {
    req.logout(() => {
        res.redirect('/');
    });
};
