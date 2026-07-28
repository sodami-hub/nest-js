// 노드 자체에서 잡아주는 에러

import fs from 'fs';

// 내장 모듈의 에러는 실행 중인 프로세스를 멈추지 않는다.
setInterval(()=> {
    fs.unlink('not_exist_file.txt', (err) => {
        if(err) {
            console.error(err);
        }
    });
},1000)