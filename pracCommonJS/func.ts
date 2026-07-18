const {odd, even} = require('./var.ts');

function checkOddOrEven(num:number): string {
    if (num % 2) {
        return odd;
    }
    return even;
}

module.exports = checkOddOrEven;