import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const users:{[key:string]:string} = {};

http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);
        if(req.method === 'GET') {
            if(req.url === '/') {
                const data = await fs.readFile(path.join(import.meta.dirname, '/restFront.html'));
                res.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
                return res.end(data);
            } else if(req.url === '/about') {
                const data = await fs.readFile(path.join(import.meta.dirname, '/about.html'));
                res.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
                return res.end(data);
            } else if(req.url ==='/users') {
                res.writeHead(200, {'content-type': 'application/json; charset=utf-8'});
                return res.end(JSON.stringify(users, null, 2));
            }
        
            // 주소가 /, /about, /users 가 아닌 경우 정적 파일을 제공하기 위한 코드이다. 예를들어 /restFront.css ... 
            try{
                const data = await fs.readFile(path.join(import.meta.dirname, req.url ? req.url : ''));
                res.writeHead(200, {'content-type': 'text/plain; charset=utf-8'});
                return res.end(data);
            } catch (err) {
                // 주소에 해당하는 라우트를 찾지 못한 경우 404 Not Found 처리
            }
        } else if (req.method === 'POST') {
            if(req.url === '/users') {
                let body = '';
                req.on('data', (data)=> {
                    body += data;
                })
                return req.on('end', () => {
                    console.log('POST 본문(Body):', body);
                    const { name } = JSON.parse(body);
                    const id = Date.now().toString();
                    users[id] = name;
                    res.writeHead(201, {'content-type': 'text/html; charset=utf-8'});
                    res.end('등록 성공');
                })
            }
        } else if(req.method ==='PUT') {
            if(req.url?.startsWith('/users/')) {
                const key = req.url.split('/')[2];
                if(!key) {
                    res.writeHead(400, {'content-type': 'text/html; charset=utf-8'});
                    return res.end('Bad Request, 잘못된 요청입니다.');
                }
                let body = '';
                req.on('data', (data)=> {
                    body += data;
                });
                return req.on('end', ()=> {
                    console.log('PUT 본문(Body):', body);
                    users[key] = JSON.parse(body).name;
                    res.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
                    return res.end(JSON.stringify(users, null, 2));
                })
            }
        } else if(req.method === 'DELETE') {
            if(req.url?.startsWith('/users/')) {
                const key = req.url.split('/')[2];
                if(!key) {
                    res.writeHead(400, {'content-type': 'text/html; charset=utf-8'});
                    return res.end('Bad Request, 잘못된 요청입니다.');
                }
                delete users[key];
                res.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
                return res.end(JSON.stringify(users, null, 2));
            }
        }
        res.writeHead(404, {'content-type': 'text/html; charset=utf-8'});
        return res.end('Not Found, 찾을 수 없는 페이지입니다.');
    } catch (err) {
        console.error(err);
        res.writeHead(500, {'content-type': 'text/html; charset=utf-8'});
        res.end(err);
    }
}).listen(8080, ()=> {
    console.log('8080번 포트에서 서버 대기 중입니다.');
});