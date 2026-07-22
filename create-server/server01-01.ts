import http from 'http';

http.createServer((req, res) => {
    // TODO : do something with the request and response
    res.writeHead(200, { 'Content-type': 'text/html; charset=UTF-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.</p>');
}).listen(8082, () => {
    console.log('Server is running at http://localhost:8082');
})

