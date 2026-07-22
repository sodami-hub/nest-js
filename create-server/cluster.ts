import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';

const numCPUs = os.cpus().length;

if(cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    // CPU 개수만큼 워커 생성
    for (let i=0; i<numCPUs; i++) {
        cluster.fork();
    }

    // 워커가 종료되었을 때
    cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid} died`);
        console.log(`code: ${code}, signal: ${signal}`);
    })
} else {
    // 워커들이 포트에서 대기
    http.createServer((req, res) => {
        res.writeHead(200, { 'content-type': 'text/html; charset=UTF-8' });
        res.write(`<h1>Hello Node.js Cluster!</h1>`);
        res.end(`<p>Worker process ID: ${process.pid}</p>`);
        setTimeout(()=> {
            process.exit(1);
        },1000);
    }).listen(8080, () => {
        console.log(`Worker ${process.pid} started`);
    });
}
