/*
util.deprecate()
util.promisify() 
*/

import util from 'node:util';
import crypto from 'node:crypto';

const dontUseMe = util.deprecate((x: number, y: number) => {
    console.log(x+y);
}, 'dontUseMe 함수는 deprecated 되었습니다. 다른 함수를 사용하세요.');

dontUseMe(1, 2);

const randomBytesPromise = util.promisify(crypto.randomBytes);

randomBytesPromise(64)
    .then((buf) => {
        console.log('randomBytesPromise:', buf.toString('base64'));
    }
).catch((err) => {
        console.error(err);
    }
);

const randomByte = await randomBytesPromise(64);
console.log('randomByte:', randomByte.toString('base64'));
