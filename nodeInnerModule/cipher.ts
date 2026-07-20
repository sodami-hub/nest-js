import crypto from 'node:crypto';

const algorithm = 'aes-256-cbc'; // 암호화 알고리즘
const key = 'abcdefghijklmnopqrstuvwxyz123456'; // 32바이트 키
const iv = '1234567890123456'; // 16바이트 초기화 벡터

const cipher = crypto.createCipheriv(algorithm, key, iv); // 암호화 객체 생성
const result = cipher.update('암호화할 문자열', 'utf8', 'base64') + cipher.final('base64'); // 암호화 수행
console.log('암호화 결과:', result); // 암호화 결과 출력

const decipher = crypto.createDecipheriv(algorithm, key, iv);
// base64, utf8 을 인코딩 순서와 반대로 전달한다.
const original = decipher.update(result, 'base64', 'utf8') + decipher.final('utf8'); // 복호화 수행
console.log('복호화 결과:', original); // 복호화 결과 출력