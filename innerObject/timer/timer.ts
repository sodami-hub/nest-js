/*
setTimeout(콜백 함수, 밀리초) : 지정된 밀리초 후에 콜백 함수를 실행합니다.
setInterval(콜백 함수, 밀리초) : 지정된 밀리초마다 콜백 함수를 반복적으로 실행합니다.
setImmedated(콜백 함수) : 콜백함수를 즉시실행
--> 위의 함수들은 모두 아이디를 반환한다. 아이디를 사용하면 타이머를 취소할 수 있다.
clearTimeout(아이디) : setTimeout()으로 설정한 타이머를 취소합니다.
clearInterval(아이디) : setInterval()으로 설정한 타이머를 취소합니다.
clearImmediate(아이디) : setImmediate()로 설정한 타이머를 취소합니다.
*/

/*
즉시 실행된다.
1초마다 실행된다.
1.5초 후에 실행된다.
1초마다 실행된다.
*/
const timeout = setTimeout(()=> {
    console.log('1.5초 후에 실행된다.')
},1500);

const interval = setInterval(()=> {
    console.log('1초마다 실행된다.')
},1000);

const timeout2 = setTimeout(()=> {
    console.log('실행되지 않는다.')
},3000);

setTimeout(()=> {
    clearTimeout(timeout2);
    clearInterval(interval);
},2500);

const immediate = setImmediate(()=> {
    console.log('즉시 실행된다.')
});

const immediate2 = setImmediate(() => {
    console.log('실행되지 않는다.')
});

clearImmediate(immediate2);