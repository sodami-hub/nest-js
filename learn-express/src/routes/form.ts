import express from 'express';
import path from 'path';
import multer from 'multer';

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, path.join(import.meta.dirname, '..', '..', 'uploads'));
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

// Get '/form' router
router.get('/', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, '..', 'views', 'multipart.html'));
});

// 파일을 하나만 업로드하는 경우 single() 메서드를 사용하고, 업로드할 파일의 name 속성값을 인수로 넣는다.
router.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file, req.body);
    res.send('ok');
});

// 파일을 여러개 업로드하는 경우 array() 메서드를 사용하고, 업로드할 파일의 name 속성값을 인수로 넣는다.
router.post('/uploads', upload.array('many'), (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
});

// 파일을 여러개 업ㄷ로드하지만 각각 다른 name 속성값을 가진 경우 fields() 메서드를 사용하고,
// 업로드할 파일의 name 속성값을 배열로 넣는다.
router.post('/dynamic', upload.fields([{ name: 'image1' }, { name: 'image2' }]), (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
});

// 파일을 업로드하지 않고 멀티파트 형식으로 업로드하는 경우 none() 메서드를 사용한다. (req.body만 존재)
router.post('/noFile', upload.none(), (req, res) => {
    console.log(req.body);
    res.send('ok');
});

export default router;
