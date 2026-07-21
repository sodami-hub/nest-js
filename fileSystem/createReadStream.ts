import fs from 'fs';

const readStream = fs.createReadStream('./readme3.txt', { highWaterMark: 16 });
const data:(Uint8Array<ArrayBufferLike>)[] = [];

readStream.on('data', (chunk) => {
    data.push(chunk as Buffer);
    console.log('data : ', chunk, chunk.length);
});

readStream.on('end', () => {
    console.log('end : ', Buffer.concat(data).toString());
});

readStream.on('error', (err) => {
    console.log('error : ', err);
});