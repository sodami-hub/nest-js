import express from 'express';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import multer from 'multer';
import fs from 'fs';
import nunjucks from 'nunjucks';

import indexRouter from './routes/index.ts';
import userRouter from './routes/user.ts';
import formRouter from './routes/form.ts';

try {
    fs.readdirSync('uploads');
} catch (error) {
    fs.mkdirSync('uploads');
}

// ✨ multer : => ./routes/form.ts 파일에서 multer를 사용하고 있다.
/* multer : 멀티파트(이미지, 동영상, 파일) 데이터를 처리하는 미들웨어
multer 함수의 인수로 설정을 넣는다.
storage : 저장할 위치(destination)와 파일 이름(filename)을 설정할 수 있다.
    - req에는 요청에 대한 정보, file에는 업로드된 파일에 대한 정보, done은 콜백함수
    - 아래 설정에는 uploads 폴더에 [파일명+현재시간.확장자] 형태로 저장된다.
limits : 업로드에 대한 제한 사항을 설정할 수 있다. (파일 크기, 파일 개수 등)

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
*/

const app = express();
app.set('port', process.env.PORT || 3000);

const viewPath = path.join(import.meta.dirname, 'views');
// nunjucks : 템플릿 엔진, HTML 파일을 렌더링할 수 있다. (ejs, pug, handlebars 등도 가능)
// 템플릿 엔진을 사용하려면 res.render() 메서드를 사용해야 한다. (res.send()는 템플릿 엔진을 사용하지 않는다.)
// cf. routes/index.ts 파일에서 res.render() 메서드를 사용해서 템플릿 엔진을 사용하고 있다.
app.set('view engine', 'html'); // html과 구분하고 싶으면 njk 확장자를 사용한다.
nunjucks.configure(viewPath, {
    // 템플릿 파일들의 위치 ./views
    express: app,
    watch: true, // html 파일이 변경되면 자동으로 렌더링한다. chokidar 라이브러리를 사용한다. (설치 필요)
});

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

/* 
Express.use() : Express 애플리케이션에 미들웨어를 연결하는 메서드이다.
아래 코드또한 본질적으로는 미들웨어 함수이다. 
인자로 전달한 모듈은 Express.Router() 객체를 반환하고 있고, 라우터는 "라우팅 기능을 가진 미들웨어" 라고 이해할 수 있다.

결국 앞선 미들웨어를 지나오고 '/' 경로로 요청이 들어오면 indexRouter 라우터가 실행되고,
'/user' 경로로 요청이 들어오면 userRouter 라우터가 실행된다.
*/
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/form', formRouter); // form 라우터 연결

// 와일드카드(*) 라우터 : 모든 요청을 처리하는 라우터, 라우터의 마지막에 위치해야 한다.
/* 선택적 라우터
'/*wild' => /wild, /wild/abc, /wild/abc/def 등 모든 요청을 처리한다.
그러나 '/' 요청은 처리하지 못한다. (위에서 처리하는 라우터가 없다고 하더라도)
'/' 요청까지 처리하고 싶으면 '/{*wild}' 라고 작성해야 한다. (중괄호 안에 *를 넣어야 한다.) => 선택적 라우터
예를들어 
'/post{*name}' => /post, /post/abc, /post/abc/def 등 모든 요청을 처리한다.
'/post*name' => /post 는 처리하지 못한다. 
*/
app.use('/*wild', (req, res, next) => {
    if (req.baseUrl === '/abc') {
        // /abc 요청이 들어오면 next()를 호출해서 다음 라우터로 이동한다.(404 처리)
        return next();
    }
    res.status(200).send('나머지 모든 라우터에 매칭되는 와일드카드 라우터');
});

// 404 Not Found 처리 미들웨어
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
