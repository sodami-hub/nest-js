import express from 'express';
import db from '../drizzle/connection.ts';
import {users} from '../drizzle/schema.ts';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const userData = await db.select().from(users);
        res.render('drizzle', {users});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;