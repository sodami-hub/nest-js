const string ='abc';
const number = 1;
const boolean = true;
const obj = {
    outside: {
        inside: {
            key: 'value',
        },
    },
};

console.time('전체시간');
console.log('평범한 로그, 쉼표로 구분해 여러 값을 찍을 수 있다.')
console.log(string, number,boolean);

console.error('에러 로그, console.error()를 사용하면 빨간색으로 표시된다.');

console.table([{name:'sodami', birth:2019},{name:'crazy', birth:2022}]);

console.dir(obj, { colors: false, depth: 2 });
console.dir(obj, { colors: true, depth: 1 });

console.time('시간측정');
for(let i =0; i < 100000; i++) {}
console.timeEnd('시간측정');

function b() {
    console.trace('에러 위치 추적');
}
function a() {
    b();
}
a();

console.timeEnd('전체시간');