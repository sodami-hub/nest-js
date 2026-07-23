import express from 'express';

const router = express.Router();

// Get '/user' router
router.get('/', (req,res) => {
    res.send('Hello User');
})

export default router;