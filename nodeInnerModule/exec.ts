// 2.6.8 child_process

import { exec } from 'node:child_process';

const process = exec('ls -al');

process.stdout?.on('data', function(data) {
    console.log(data.toString());
});

process.stderr?.on('data', function(data) {
    console.error(data.toString());
})
