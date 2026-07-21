import fs from 'fs';
import fsP from 'fs/promises';


// .then 형식이 아니라 await 형식으로 아래와 같이 사용 가능하다.
// await fsP.writeFile('./writeFile3.txt','HelloWorld03');

// const fileMsg3 = await fsP.readFile('./writeFile3.txt');
// console.log("import fs/promises : ",fileMsg3.toString());

fsP.writeFile('./writeFile2.txt','HelloWorld2').then(() => {
    fs.readFile('./writeFile2.txt', (err, data) => {
        if (err) {
            throw err;
        }
        console.log(data.toString());
    })
})

fs.writeFile('./writeFile.txt','HelloWorld', (err) => {
    if (err) {
        throw err;
    }

    fs.readFile('./writeFile.txt', (err, data) => {
        if (err) {
            throw err;
        }
        console.log(data.toString());
    })
})

