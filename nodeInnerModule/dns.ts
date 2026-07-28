// dns가 콜백 버전이다... 콜백함수가 필요하다.
import dns from 'node:dns';

// async/await 방식을 사용하려면 아래와같이 promise를 사용해야한다.
import dnsPromise from 'node:dns/promises';

const ip = dns.lookup('www.naver.com', (
    err:NodeJS.ErrnoException | null,
    address:string,
    family:number
) => 
    {
        console.log('address', address);
        console.log('family', family);
        if(err) {
            console.error('Error occurred:', err);
        }
    }
);

const ip02 = await dnsPromise.lookup('www.naver.com');
console.log('ip02', ip02);

const a = await dnsPromise.resolve('www.naver.com');
console.log('A', a);

const mx = await dnsPromise.resolve('www.naver.com','MX');
console.log('MX', mx);

const cname = await dnsPromise.resolve('www.naver.com','CNAME');
console.log('CNAME', cname);

const any = await dnsPromise.resolve('www.naver.com','ANY');
console.log('ANY', any);

