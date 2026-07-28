import crypto from 'node:crypto';

// 단방향 pbkdf2 함수

// salt에 따라서 같은 비밀번호라도 다른 결과값이 나옴. salt는 무작위로 생성하는 것이 좋음. salt는 16~64바이트 정도가 적당함.
// 따라서 salt 값을 잘 보관해야함. salt 값이 유출되면 비밀번호를 알아낼 수 있음. salt 값은 DB에 같이 저장하는 것이 일반적임.
crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    console.log('salt:', salt);
    // 비밀번호, salt, 반복횟수, 출력 바이트, 해시알고리즘을 인수로 넣어서 암호화
    // crypto.randomBytes, crypto.pbkdf2 메서드는 내부적으로 스레드 풀을 사용해서 멀티 스레딩을 동작한다. 
    // 비동기 방식으로 동작하기때문에 블로킹에 대한 염려 x. 동기 방식으로 동작하는 crypto.pbkdf2Sync 메서드도 존재함.
    crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
        console.log('password:', key.toString('base64'));
    });
});