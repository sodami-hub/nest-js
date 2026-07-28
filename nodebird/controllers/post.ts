import type { NextFunction, Request, Response } from 'express';
import db from '../drizzle/connection.ts';
import { posts, hashtags, postsToHashtags } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import type { MyUserType as myUserType } from '../types/type.ts';

export const afterUploadImage = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
};

export const uploadPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = req.user as myUserType | undefined;
        if(!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const [result] = await db.insert(posts).values({
            content: req.body.content,
            img: req.body.url,
            userId: user.id,
        });
        const insertId = result.insertId;
        // 공백이나 다른 #이 나오기 전까지 하나의 해시태그로 인식
        const hashtag: string[] | null = req.body.content.match(/#[^\s#]+/g);
        if (hashtag) {
            const result = await Promise.all(
                hashtag.map(async (tag: string) => {
                    const ex = await db
                        .select()
                        .from(hashtags)
                        .where(eq(hashtags.title, tag.slice(1).toLowerCase()))
                        .limit(1);
                    if (ex.length) {
                        return ex[0];
                    }
                    await db.insert(hashtags).values({
                        title: tag.slice(1).toLocaleLowerCase(),
                    });
                    const newHashtags = await db
                        .select()
                        .from(hashtags)
                        .where(eq(hashtags.title, tag.slice(1).toLowerCase()))
                        .limit(1);
                    return newHashtags[0];
                }),
            );
            await db.insert(postsToHashtags).values(
                result
                    .filter((hashtag) => hashtag !== undefined)
                    .map((hashtag) => ({
                        postId: insertId,
                        hashtagId: hashtag.id,
                    })),
            );
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};
