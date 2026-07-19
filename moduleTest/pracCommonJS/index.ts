const {odd, even} = require('./var.ts');
const checkNumber = require('./func.ts');

function checkStringOddOrEven(str: string): string {
    if (str.length %2) {
        return odd;
    }
    return even;
}

console.log(checkNumber(10));
console.log(checkStringOddOrEven('TypeScript'));