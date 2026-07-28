import url from 'node:url';

const {URL} = url;

const myURL = new URL('https://example.com:8080/path/name?query=string#hash');

console.log('new URL():', myURL);
console.log('url.format():', url.format(myURL));