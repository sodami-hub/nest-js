import path from "node:path";

const string = import.meta.filename;

console.log('path.sep:', path.sep);
console.log('path.delimiter:', path.delimiter);

console.log('------------------------------------');
console.log('path.dirname():', path.dirname(string));
console.log('path.extname():', path.extname(string));
console.log('path.basename():', path.basename(string));
console.log('path.basename - extname:', path.basename(string, path.extname(string)));

console.log('------------------------------------');
console.log('path.parse():', path.parse(string));
console.log('path.format():', path.format({
    dir: 'C:/users/leejinhun',
    name: 'path',
    ext: '.ts'
}));
console.log('path.normalize():', path.normalize('C:/users//leejinhun//path.ts'));

// 첫번째 경로에서 두번째 경로로 가는 방법 path.relative(기준경로, 대상경로)
console.log('path.relative():', path.relative('C:/users/leejinhun/projects/nest.js/nodeInnerModule', 'C:/users/leejinhun/'));

console.log('path.join():', path.join('C:/users', 'leejinhun', 'projects', 'nest.js', 'nodeInnerModule'));
console.log('path.resolve():', path.resolve('C:/users', 'leejinhun', '/','projects', 'nest.js', 'nodeInnerModule'));