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
    limits: { fileSize: 5 * 1024 * 1024 },
});

const app = express();
app.set('port', process.env.PORT || 3000);

/*
앞으로 사용할 미들웨어를 장착한 상태.. 설치된 패키지들을 불러서 app.use에 연결
req, res, next가 보이지 않지만 내부에 들어있다.
*/
// morgan : 요청과 응답에 대한 정보를 콘솔에 기록 dev, combined, common, short, tiny
app.use(morgan('dev'));

// express.static() : 정적 파일 제공 미들웨어, public 폴더 안에 있는 파일들을 제공
// ./public/abcd/efg.html => http://localhost:3000/abcd/efgh.html
// public 폴더 안에 있는 파일들을 제공하지만 public을 제외하고 요청할 수 있다.(보안상 이유)
// 파일이 있으면 next()를 호출하지 않고 바로 응답을 보내고, 파일이 없으면 next()를 호출해서 다음 미들웨어로 넘어간다.
app.use('/', express.static(path.join(import.meta.dirname, 'public')));

/* body-parser : 요청 본문을 해석해서 req.body 객체로 만들어주는 미들웨어
폼 데이터, AJAX 요청의 데이터 처리. 단, 멀티파트(이미지, 동영상, 파일) 데이터는 처리하지 못한다. multer를 사용해야 한다.
*/
app.use(express.json()); // JSON 요청 본문을 해석해서 req.body 객체로 만들어준다.
/*
URL-encoded(폼전송) 요청 본문을 해석해서 req.body 객체로 만들어준다.
extended: true => qs 라이브러리 사용, false => querystring 라이브러리 사용
name=lee&age=20 => { name: 'lee', age: '20' } 형태로 req.body 객체를 만들어준다.
*/
app.use(express.urlencoded({ extended: true })); 
// 버퍼나, 문자열 요청을 처리하고 싶을때는 아래와 같이 추가한다.
//app.use(express.raw()); // 요청 본문이 버퍼 데이터일때
//app.use(express.text()); // 요청 본문이 문자열일때
//==============================================================


/* cookie-parser : 요청에 포함된 쿠키를 해석해서 req.cookies 객체로 만들어주는 미들웨어
해석된 쿠키들은 req.cookies 객체에 들어간다.
name=lee => req.cookies = { name: 'lee' }
서명된 쿠키는 req.signedCookies 객체에 들어간다.

쿠키 생성 : res.cookie('name', 'lee', { signed: true, httpOnly: true }); // 키, 값, 옵션
쿠키 삭제 : res.clearCookie('name', { httpOnly: true, secure: true }); // 키, 옵션도 동일해야됨(expires, maxAge 는 생략가능)

옵션중에 signed: true 옵션을 주면 쿠키를 서명해서 보낸다. 서명된 쿠키는 req.signedCookies 객체에 들어간다.
비밀키는 cookieParser()에 인수로 넣은 값을 사용한다.
*/
app.use(cookieParser('process.env.COOKIE_SECRET'));

/* express-session : 세션을 생성하고 관리하는 미들웨어 
현재 세션의 아이디는 req.sessionID(req.session.id)에 들어있다.
세션에 저장된 id 값을 주고 받으면서 서버에서는 해당 id(key)에 해당하는 데이터를 저장하고 관리한다.
세션은 서버에 저장되기 때문에 쿠키보다 안전하다.
*/
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: 'process.env.COOKIE_SECRET',
        cookie: {
            httpOnly: true,
            secure: false,
        },
        name: 'session-cookie', // 세션쿠키의 이름 기본값은 connect.sid
    }),
);

app.get('/upload', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'multipart.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file, req.body);
    res.send('ok');
});

app.get('/', (req, res) => {
    res.send('Hello, Express');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
