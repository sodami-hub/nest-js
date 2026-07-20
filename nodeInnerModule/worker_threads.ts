import {Worker, isMainThread, parentPort } from 'node:worker_threads';

if (isMainThread) {
    const worker = new Worker(import.meta.filename);
    worker.on('message', message => console.log('from worker:', message));
    worker.on('exit', ()=>console.log('worker exit'));
    worker.postMessage('ping');
} else {
    parentPort?.on('message', (value)=> {
        console.log('from parent:', value);
        parentPort?.postMessage('pong');
        parentPort?.close();
    });
}