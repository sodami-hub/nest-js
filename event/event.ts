import EventEmitter from "node:events";

const myEvent = new EventEmitter();
myEvent.addListener('event1', ()=> {
    console.log('event1 triggered');
});

// on(), addListener()는 동일한 기능을 수행합니다. 이벤트를 등록하는 메서드입니다.
myEvent.on('event2', ()=> {
    console.log('event2 triggered');
});

myEvent.on('event2', ()=> {
    console.log('add event2 triggered');
});

myEvent.once('event3', ()=> {
    console.log('event3 triggered');
}); // 한 번만 실행됨

myEvent.emit('event1');
myEvent.emit('event2');

myEvent.emit('event3');
myEvent.emit('event3');

myEvent.on('evnet4', ()=> {
    console.log('event4 triggered');
});
myEvent.removeAllListeners('event4');
myEvent.emit('event4'); // 실행되지 않음

const listener = () => {
    console.log('event5 triggered');
}
const listener2 = () => {
    console.log('event5 triggered2');
}
myEvent.on('event5', listener);
myEvent.on('event5', listener2);

// 이벤트 리스너 제거 : 이벤트에 연결된 리스너를 각각 제거함
myEvent.removeListener('event5', listener);
myEvent.emit('event5'); // 실행되지 않음

// listenerCount() : 이벤트에 연결된 리스너의 수를 반환함
console.log('total count of event2 listener :', myEvent.listenerCount('event2'));
console.log('total count of event5 listener :', myEvent.listenerCount('event5'));