// URL, URLSearchParams 모두 노드 내장 객체이므로 import 생략가능

const myURL = new URL('https://example.com:8080/path/name?query=string&page=3&limit=50&category=nestjs&category=ts#hash');

console.log('searchParams:', myURL.searchParams);
console.log('searchParams.get():', myURL.searchParams.get('category'));
console.log('searchParams.get():', myURL.searchParams.get('limit'));
console.log('searchParams.getAll():', myURL.searchParams.getAll('category'));
console.log('searchParams.has():', myURL.searchParams.has('page'));
console.log('searchParams.keys():', myURL.searchParams.keys());
console.log('searchParams.values():', myURL.searchParams.values());

myURL.searchParams.append('filter','es3');
myURL.searchParams.append('filter','es5');
console.log(myURL.searchParams.getAll('filter'));

myURL.searchParams.set('filter','es6');
console.log(myURL.searchParams.getAll('filter'));

myURL.searchParams.delete('filter');
console.log(myURL.searchParams.getAll('filter'));

console.log('searchParams.toString():', myURL.searchParams.toString());
myURL.search = myURL.searchParams.toString();