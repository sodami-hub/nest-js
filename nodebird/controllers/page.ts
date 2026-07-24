import type { Request, Response, NextFunction } from 'express';

export const renderProfile = (req:Request, res:Response) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
}

export const renderJoin = (req:Request, res:Response) => {
    res.render('join', { title: '회원가입 - NodeBird' });
}

export const renderMain = (req:Request, res:Response, next:NextFunction) => {
    const twits:string[] = [];
    res.render('main', { title: 'NodeBird', twits }); 
};