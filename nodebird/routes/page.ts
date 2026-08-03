import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.ts';
import { renderProfile, renderJoin, renderMain, renderHashtag } from '../controllers/page.ts';

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.followers?.length ?? 0;
    res.locals.followingCount = req.user?.followings?.length ?? 0;
    res.locals.followingIdList = req.user?.followings?.map(f => f.following.id) ?? [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile); // 자신의 프로필은 로그인 상태여야 볼수있다. isLggedIn 미들웨어에서 next()가 호출되면 renderProfile 컨트롤러가 실행된다.
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/', renderMain);
router.get('/search', renderHashtag);

export default router;
