import http from 'node:http';
import fs from 'node:fs/promises';

const server = http.createServer(async (req, res) => {
    try {
        const data = await fs.readFile('./server02.html', 'utf-8'); 
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(data);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('Internal Server Error : ' + err);
    }
});

server.listen(8082);
server.on('listening', ()=> {
    console.log('Server is running at http://localhost:8082');
});
server.on('connection', ()=> {
    console.log('Client connected');
});