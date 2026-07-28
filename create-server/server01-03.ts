import http from 'node:http';

// 한번에 여러 서버를 실행한다.

http.createServer((req, res) => {
    // TODO : do something with the request and response
    res.writeHead(200, { 'Content-type': 'text/html; charset=UTF-8' });
    res.write('<h1>Hello Node! at :8082</h1>');
    res.end('<p>Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.</p>');
}).listen(8082, () => {
    console.log('Server is running at http://localhost:8082');
});

http.createServer((req, res) => {
    // TODO : do something with the request and response
    res.writeHead(200, { 'Content-type': 'text/html; charset=UTF-8' });
    res.write('<h1>Hello Node! at :8083</h1>');
    res.end('<p>Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.</p>');
}).listen(8083, () => {
    console.log('Server is running at http://localhost:8083');
});