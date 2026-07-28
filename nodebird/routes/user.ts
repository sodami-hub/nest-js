import express from 'express';
import { isLoggedIn } from '../middlewares/index.ts';
import { follow } from '../controllers/user.ts';

const router = express.Router();

// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);

export default router;
