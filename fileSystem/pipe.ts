import fs from 'fs';

const readStream = fs.createReadStream('./readme.txt');
const writeStream = fs.createWriteStream('./readme_copy.txt');

readStream.pipe(writeStream);