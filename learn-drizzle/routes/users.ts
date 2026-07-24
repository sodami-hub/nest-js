import express from 'express';
import db from '../drizzle/connection.ts';
import { users as usersTable } from '../drizzle/schema.ts';
import { comments as commentsTable } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.route('/')
.get(async (req, res, next) => {
    try {
        const users = await db.select().from(usersTable);
        res.json(users);
    } catch (err) {
        console.error(err);
        next(err);
    }
})
.post(async (req, res, next) => {
    try {
        await db.insert(usersTable).values({
            name: req.body.name,
            age: req.body.age,
            married: req.body.married,
        });
        res.status(200).send('ok');
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.get('/:id/comments', async (req,res,next) => {
    const commenterId = req.params.id;
    if(!commenterId || isNaN(Number(commenterId))) {
        const error:Error & {status?:number} = new Error('Invalid commenter ID');
        error.status = 400;
        return next(error);
    }
    
    try {
        const comments = await db.query.comments.findMany({
            with: {
                user: {
                    columns:{
                        name: true,
                    },
                },
            },
            where: eq(commentsTable.commenter, Number(commenterId)),
        });
        console.log(comments);
        res.json(comments);
    }catch(err) {
        console.error(err);
        next(err);
    }
})


export default router;
