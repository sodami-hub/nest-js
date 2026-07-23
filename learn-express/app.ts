import express from 'express';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import multer from 'multer';
import fs from 'fs';

try {
    fs.readdirSync('uploads');
} catch (error) {
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
        const ext = path.extname(file.originalname);
        done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits:{ fileSize: 5 * 1024 * 1024 },
});


const app = express();
app.set('port', process.env.PORT || 3000);

/*
앞으로 사용할 미들웨어를 장착한 상태.. 설치된 패키지들을 불러서 app.use에 연결
req, res, next가 보이지 않지만 내부에 들어있다.
*/
app.use(morgan('dev'));
app.use('/', express.static(path.join(import.meta.dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('process.env.COOKIE_SECRET'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'process.env.COOKIE_SECRET',
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.get('/upload', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'multipart.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file, req.body);
    res.send('ok');
})


app.get(
    '/',
    (req, res) => {
        res.send('Hello, Express');
    }
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
