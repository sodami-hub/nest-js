import db from '../drizzle/connection.ts';
import { follows, users } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import type { Request, Response, NextFunction } from 'express';
import type { MyUserType as myUserType } from '../types/type.ts';

export const follow = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const loggedInUser = req.user as myUserType | undefined;
        if (!loggedInUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await db.select().from(users).where(eq(users.id, loggedInUser.id)).limit(1);
        if (user.length) {
            const followingId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            if (!followingId) {
                res.status(400).send('Invalid user id');
                return;
            }
            await db.insert(follows).values({
                followerId: loggedInUser.id,
                followingId,
            });
            res.send('success');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};
