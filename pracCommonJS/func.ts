// 각각의 변수 odd와 even을 var.ts에서 가져옵니다.
const {odd, even} = require('./var.ts');
const odd02 = require('./var.ts').odd02;
const even02 = require('./var.ts').even02;

/* 객체의 형태로 받을 수도 있다.
const values = require('./var');

console.log(values.odd);
console.log(values.even);
 */


function checkOddOrEven(num:number): string {
    if (num % 2) {
        return odd02;
    }
    return even02;
}

// 함수 자체를 내보냄 이 경우 module.exports 의 값 자체가 함수이다. 따라서 가져온 결과를 바로 호출 할 수 있다.
module.exports = checkOddOrEven;

/*
함수를 {} 묶어서 내보내는 것도 가능하다.
그러면 내보낸 값은 함수 자체가 아니라 함수를 속성으로 가진 객체이고, 가져오는 방법도 달라진다.

module.exports = {checkOddOrEven};
=> 아래와 같은 형태가 된다.
module.exports = {
    checkOddOrEven: checkOddOrEven
}

------

const {checkOddOrEven} = require('./func.ts');
checkOddOrEven(10);

또는

const func = require('./func.ts');
func.checkOddOrEven(10);
*/