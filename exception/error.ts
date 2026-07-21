/*
노드의 메인 스레드는 하나뿐이기때문에 그 하나를 소중히 보호해야 한다. 메인 스레드가 에러로 멈춘다는 것은
스레드를 가지고 있는 프로세스가 멈춘다는 뜻이고, 전체 서버도 멈춘다는 의미이다.
*/

// 에러는 발생하지만 try - catch로 잡아주기 때문에 서버는 멈추지 않는다.
setInterval(()=> {
    console.log('start');
    try {
        throw new Error('test error');
    } catch (error) {
        console.error(error);
    }
},1000);
