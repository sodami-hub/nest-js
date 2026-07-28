// 워커 스레드를 사용하지 않고 소수를 찾는 작업

const min =2;
const max = 10000000;
const primes = [];

function findPrimes(start:number, range:number) {
    let isPrime = true;
    const end = start + range;
    for (let i = start; i < end; i++) {
        for (let j= min; j < Math.sqrt(end); j++) {
            if(i !== j && i% j ===0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
        }
        isPrime = true;
    }
    
}
console.time('prime');
findPrimes(min, max);
console.timeEnd('prime');
console.log(primes.length);