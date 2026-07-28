import http from "http";
import fs from "fs/promises";
import path from "path";

// ===== 1
const parseCookies = (cookie = '') => {
    return cookie // name=lee;birth=1999
        .split(';') // ['name=lee', 'birth=1999']
        .map(v => v.split('=')) // [['name', 'lee'], ['birth', '1999']]
        .reduce((acc:Record<string,string>, [k, v]) => { // acc 앞선 콜백의 (누적)반환값
            if( !k || !v ) return acc;
            acc[k.trim()] = decodeURIComponent(v); // acc['name'] = 'lee', acc['birth'] = '1999'
            return acc;
        }, {});
}

type sessionData = {
    name:string;
    expires:Date;
}
const session:Record<string,sessionData> = {};

http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.session;

    if(req.url?.startsWith('/login')) {
        const url = new URL(req.url, 'http://localhost:8084');
        const name = url.searchParams.get('name');
        if(!name) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('로그인 정보가 없습니다.');
        }
        const expires = new Date();
        // 쿠키 유효시간 5분
        expires.setMinutes(expires.getMinutes() + 5);

        const uniqueInt = Date.now();
        session[uniqueInt] = {
            name,
            expires
        };

        res.writeHead(302, {
            Location: '/',
            'set-cookie': `session=${uniqueInt}; Expires=${expires.toString()}; HttpOnly; Path=/`
        });
        res.end();
    } else if(sessionId && session[sessionId] && session[sessionId]?.expires > new Date()) { // 세션 쿠키가 존재하고, 만료 기간이 지나지 않았다면
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`${session[sessionId].name}님 안녕하세요.`);
    } else {
        try {
            const data = await fs.readFile(path.join(import.meta.dirname, 'cookie2.html'));
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        }catch(err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(err);
        }
    }
}).listen(8084, () => {
    console.log('Server is running on http://localhost:8084');
});



