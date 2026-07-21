// 예측 불가능한 에러 처리


// 프로세스 객체에 uncaughtException 이벤트를 등록하여 예측 불가능한 에러를 처리할 수 있습니다.
// => 처리하지 못한 에러가 발생했을 때 이벤트 리스너가 실행되고 프로세스가 유지된다.
process.on('uncaughtException', (err) => {
    console.error('예측 불가능한 에러 발생', err);
});

setInterval(()=> {
    throw new Error('destroy server');
},1000)

setTimeout(()=> {
    console.log('실행됩니다.');
}, 2000)