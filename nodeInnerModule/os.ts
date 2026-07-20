import os from "node:os";

console.log("Operating System Information:");
console.log('os.arch():', os.arch());
console.log('os.platform():', os.platform());
console.log('os.type():', os.type());
console.log('os.release():', os.release());
console.log('os.uptime():', os.uptime(), 'seconds');
console.log('os.hostname():', os.hostname());

console.log('------ 경로 -----------');
console.log('os.homedir():', os.homedir());
console.log('os.tmpdir():', os.tmpdir());

console.log('------ CPU 정보 -----------');
console.log('os.cpus():', os.cpus());
console.log('os.cpus().length:', os.cpus().length);

console.log('------ 메모리 정보 -----------');
console.log('os.totalmem():', os.totalmem(), 'bytes');
console.log('os.freemem():', os.freemem(), 'bytes');