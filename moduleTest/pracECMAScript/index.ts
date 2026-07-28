import {odd, even } from './var.ts';
import checkNumber from './func.ts';

function checkStringOddOrEven(str:string):string {
    if(str.length %2) {
        return odd;
    }
    return even;
}

console.log(checkNumber(10));
console.log(checkStringOddOrEven('nest.js + node.js + typescript'));
