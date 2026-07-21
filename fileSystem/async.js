import fs from 'fs';

console.log('start');

fs.readFile('./readme2.txt', 'utf-8', (err, data) => {
    if(err) {
        throw err;
    }
    console.log('1st', data.toString())
});
fs.readFile('./readme2.txt', 'utf-8', (err, data) => {
    if(err) {
        throw err;
    }
    console.log('2nd', data.toString())
});
fs.readFile('./readme2.txt', 'utf-8', (err, data) => {
    if(err) {
        throw err;
    }
    console.log('3rd', data.toString())
});
console.log('end');