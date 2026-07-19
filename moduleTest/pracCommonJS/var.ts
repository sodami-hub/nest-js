const odd = 'CJS 홀수입니다.';
const even = 'CJS 짝수입니다.';

/* 
아래와 같은 형식으로 내보낼 수 있다. 이경우 module.exports 가 없어야 된다. 
exports 는 module.exports 의 별칭이므로, module.exports 가 있으면 exports 는 무시된다(덮어씌워짐).

exports.odd02 = 'CJS 홀수입니다-02';
exports.even02 = 'CJS 짝수입니다-02';
*/

module.exports = {odd, even};
/*
객체 축약 문법, 실제로는 다음과 같다.
module.exports ={
    odd: odd,
    even: even
}
*/
