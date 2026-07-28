import fs from 'fs';
import fsP from 'fs/promises';
import util from 'node:util';

const readFileP = util.promisify(fs.readFile);

fs.readFile('./readme.txt', (err,data) => {
    if(err) {
        throw err;
    }
    console.log(data);
    console.log(data.toString());
})

const fildMsg = await readFileP('./readme.txt');
console.log("use util.promisify() : ",fildMsg.toString());

const fileMsg2 = await fsP.readFile('./readme.txt');
console.log("import fs/promises : ",fileMsg2.toString());