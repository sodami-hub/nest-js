import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import nunjucks from 'nunjucks';

import type { error as myError } from './types/type.ts';
import pageRouter from './routes/page.ts';

const app = express();
app.set('port', process.env.PORT || 8888);

app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
        httpOnly: true,
        secure: false,
    },  
}));

app.use('/', pageRouter);

app.use((req, res, next) => {
    const error:myError = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err:myError, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), 'port server start');
});