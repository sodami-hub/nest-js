/*
tsconfig.json 에 compilerOptions 설정을 추가하여 ts 파일을 import할 때 .ts 확장자 사용 가능하도록 허용
"allowImportingTsExtensions": true,
    "noEmit": true,
*/
import {odd, even} from './var.ts';

function checkOddOrEven(num:number):string {
    if(num % 2) {
        return odd;
    }
    return even;
}

export default checkOddOrEven;