setImmediate(()=> {
    console.log('setImmediate executed');
});
Promise.resolve().then(()=>console.log('promise executed'));

process.nextTick(()=> {
    console.log('nextTick executed');
})

setTimeout(()=> {
    console.log('setTimeout executed');
}, 0);

