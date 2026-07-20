// 단방향 암호화 hash 함수
// createHash(알고리즘).update(문자열).digest(인코딩) 형태로 사용
// 알고리즘 md5, sha1, sha256, sha512 등 다양하게 존재. md5, sha1은 취약점이 발견됨
// 인코딩 base64, hex 등 다양하게 존재. base64가 문자열이 짦아서 가장 많이 사용됨.
import crypto from 'node:crypto';

console.log('base64:', crypto.createHash('sha512').update('비밀번호').digest('base64'));
console.log('hex:', crypto.createHash('sha512').update('비밀번호').digest('hex'));
console.log('base64:', crypto.createHash('sha512').update('다른 비밀번호').digest('base64'));

// 현재는 pbkdf2, bcrypt, scrypt 등 단방향 암호화 알고리즘이 존재. 노드에서 지원하는 알고리즘은 pbkdf2
