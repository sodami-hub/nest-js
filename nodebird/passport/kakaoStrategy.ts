import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import db from '../drizzle/connection.ts';
import { eq, and } from 'drizzle-orm';
import { users } from '../drizzle/schema.ts';

export default () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID as string,  // 카카오에서 발급 id,pw
                clientSecret: process.env.KAKAO_SECRET as string,
                callbackURL: '/auth/kakao/callback',    // 카카오로부터 인증결과를 받을 라우터 주소
            },
            /*카카오는 인증 후 accessToken, refreshToken, profile(사용자 정보) 정보를 전달한다.
                - 카카오 로그인 시에는 먼저 기존에 카카오를 통해 회원 가입한 사용자가 있는지 조회한다. 
                있다면 이미 회원 가입한 사용자이므로 사용자 정보와 함께 done 함수를 호출하고 종료한다.
                - 기존에 가입한 정보가 없다면 profile 객체에서 정보를 추출하여 회원 가입을 한다.
            */
            async (accessToken, refreshToken, profile, done) => { 
                console.log('kakao profile', profile);
                try {
                    const exUser = await db
                        .select()
                        .from(users)
                        .where(
                            and(eq(users.id, profile.id.toString()), eq(users.provider, 'kakao')),
                        )
                        .limit(1);
                    if (exUser.length) {
                        done(null, exUser[0], undefined);
                    } else {
                        await db.insert(users).values({
                            id: profile.id.toString(),
                            nick: profile.displayName,
                            provider: 'kakao',
                        });
                        const newUser = await db
                            .select()
                            .from(users)
                            .where(eq(users.id, profile.id.toString()))
                            .limit(1);
                        done(null, newUser[0], undefined);
                    }
                } catch (error) {
                    console.error(error);
                    done(error as Error);
                }
            },
        ),
    );
};
