import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { afterUploadImage, uploadPost } from '../controllers/post.ts';
import { isLoggedIn } from '../middlewares/index.ts';

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})

// POST /post/img : 이미지만 저장
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

const upload2 = multer();
// Post /post : 게시글 저장(+ 이미지의 주소만)
router.post('/', isLoggedIn, upload2.none() ,uploadPost);

export default router;