import type { Request, Response, NextFunction } from 'express';

/*
Passport는 req 객체에 isAuthenticated() 메서드를 추가한다.
로그인 상태면 true, 아니면 false를 반환한다.
로그인 상태를 확인하는 미들웨어 isLoggedIn과 isNotLoggedIn을 만들어서 라우터에서 사용할 수 있다.
*/

export const isLoggedIn = (req:Request, res:Response, next:NextFunction) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
}

export const isNotLoggedIn = (req:Request, res:Response, next:NextFunction) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};
