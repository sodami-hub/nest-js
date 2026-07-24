import express from 'express';
import db from '../drizzle/connection.ts';
import { users as usersTable } from '../drizzle/schema.ts';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await db.select().from(usersTable);
        res.render('drizzle', { users });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;
