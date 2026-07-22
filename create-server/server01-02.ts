import http from 'node:http';

// http.createServer((req, res) => {
//     // TODO : do something with the request and response
//     res.writeHead(200, { 'Content-type': 'text/html; charset=UTF-8' });
//     res.write('<h1>Hello Node!</h1>');
//     res.end('<p>Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.</p>');
// }).listen(8082, () => {
//     console.log('Server is running at http://localhost:8082');
// })

// 위와같이 listen() 메서드에 콜백함수를 넣는 대신, 아래와 같이 이벤트 리스너를 붙일 수 있다.

const server = http.createServer((req, res) => {
    // TODO : do something with the request and response
    res.writeHead(200, { 'Content-type': 'text/html; charset=UTF-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.</p>');
})

server.listen(8082);

server.on('listening', () => {
    console.log('start server listening at http://localhost:8082');
})