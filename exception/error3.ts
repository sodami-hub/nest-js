// 노드 16 부터는 프로미스의 에러는 반드시 catch로 잡아야 한다. 그렇지 않으면 프로세스가 종료된다.

import fs from "fs/promises";

setInterval(() => {
    fs.unlink('not_exist_file.txt').then(()=>{
        console.log('file deleted');
    }).catch((err) => {
        console.error(err);
    });
},1000);