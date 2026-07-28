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
/*
reduce() / 첫번째 인자: 콜백함수, 두번째 인자: 초기값
콜백함수의 인자: (누적값, 현재값, 현재인덱스, 원본배열) // 위 코드는 누적값, 현재값만 사용
    - 현재값은 배열의 구조 분해 패턴 전달받은 배열의 첫번째 요소는 k, 두번째 요소는 v로 전달받음
초기값 = {}
첫번째 콜백 이후 값(acc) = {name: 'lee'}
두번째 콜백 이후 값(acc) = {name: 'lee', birth: '1999'}
*/

http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);

    // ------------------- 2
    if(req.url?.startsWith('/login')) {
        /*
        브라우저의 요청 : http://localhost:8084/login?name=lee
            req.url = /login?name=lee 경로와 쿼리 스트링이 함께 들어있다. (* lee 는 엔코딩된 상태)
            new URL은 이 문자열을 구조적으로 분석하기 위해 사용한다. 
                - new URL('login?name=lee', 'http://localhost:8084') // 첫번째 상대주소, 두번째 인자는 기준 주소
            URL객체는 http://localhost:8084/login?name=lee 가 된다.
                url.origin = http://localhost:8084
                url.pathname = /login
                url.search = ?name=lee
                url.searchParams.get('name') = lee
        ✨ 위와같은 정보를 구조적으로 얻기위해서 URL 객체를 만들어서 사용한다.
            (req.url은 문자열이므로 구조적으로 분석하기 복잡하고 어렵다.)        
        */
        const url = new URL(req.url, 'http://localhost:8084');
        const name = url.searchParams.get('name');
        if(!name) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('로그인 정보가 없습니다.');
        }
        const expires = new Date();
        // 쿠키 유효시간 5분
        expires.setMinutes(expires.getMinutes() + 5);
        res.writeHead(302, {
            Location: '/',
            'set-cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toString()}; HttpOnly; Path=/`
        });
        res.end();
    } else if(cookies.name) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`${cookies.name}님 안녕하세요.`);
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



