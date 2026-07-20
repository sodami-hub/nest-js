/*
spawn, exec 의 차이는 spawn 은 새로운 프로세스를 생성하고, exec 은 새로운 쉘을 생성한다.
spawn 에서도 세 번째 인수로 { shell: true } 를 넣으면 exec 처럼 쉘을 생성한다.
*/

import {spawn} from 'child_process';

const process = spawn('python3', ['test.py']);

process.stdout?.on('data', function(data) {
    console.log(data.toString());
});

process.stderr?.on('data', function(data) {
    console.error(data.toString());
});