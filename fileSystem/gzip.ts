import zlib from 'zlib';
import fs from 'fs';

const readStream = fs.createReadStream('./readme3.txt');
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream('./readme.txt.gz');

readStream.pipe(zlibStream).pipe(writeStream);