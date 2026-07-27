import type { Request, Response, NextFunction } from 'express';
import db from '../drizzle/connection.ts';
import { posts, hashtags, postsToHashtags, users } from '../drizzle/schema.ts';
import { eq, desc } from 'drizzle-orm';

export const renderProfile = (req: Request, res: Response) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
};

export const renderJoin = (req: Request, res: Response) => {
    res.render('join', { title: '회원가입 - NodeBird' });
};

export const renderMain = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const twits = await db.query.posts.findMany({
            with: {
                user: {
                    columns: {
                        id: true,
                        nick: true,
                    },
                },
            },
            orderBy: desc(posts.createdAt),
        });
        res.render('main', { title: 'NodeBird', twits });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const renderHashtag = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query.hashtag;
    if (typeof query !== 'string' || !query.trim()) {
        return res.redirect('/');
    }
    try {
        const result = await db
            .select({ posts, user: { id: users.id, nick: users.nick } })
            .from(posts)
            .innerJoin(postsToHashtags, eq(posts.id, postsToHashtags.postId))
            .innerJoin(hashtags, eq(postsToHashtags.hashtagId, hashtags.id))
            .innerJoin(users, eq(posts.userId, users.id))
            .where(eq(hashtags.title, query))
            .orderBy(desc(posts.createdAt));
        res.render('main', {
            title: `${query} | NodeBird`,
            twits: result.map((row) => ({ ...row.posts, user: row.user })),
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
