import express from 'express';
import passport from 'passport';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.ts';
import { join, login, logout } from '../controllers/auth.ts';

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);


/* kakao 로그인/회원가입 라우터
카카오를 통한 로그인/회원가입 요청은 passport.authenticate('kakao') 미들웨어를 통해 카카오 로그인 전략을 수행하고,
done() 함수의 결과에 따라 카카오 로그인 전략의 콜백함수가 호출된다.
✨ 그러나 local 전략과는 다르게 내부적으로 로그인 처리를 수행한다.
(cf. 로컬 전략의 경우 controller/auth.ts 의 login() 컨트롤러(38line) 에서 passport.authenticate('local') 미들웨어를 통해 로컬 로그인 전략을 수행하고,
done() 함수의 결과에 따라 controller/auth.ts 의 login() 컨트롤러(38line) 의 콜백함수가 호출된다.)
*/
// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?loginError=카카오로그인실패',
}), (req, res) => {
    res.redirect('/');
});

export default router;
