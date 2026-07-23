import express from 'express';

const router = express.Router();

// Get '/' router
router.get('/', (req,res) => {
    res.send('Hello Express!')
})

export default router;
