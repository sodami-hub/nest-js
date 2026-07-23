import express from 'express';

const app = express();
app.set('port', process.env.PORT || 3000);

// app.get(주소, 라우터) : 주소에 대한 GET 요청이 올 때 어떤 동작을 할지 라우터를 설정
app.get('/', (req, res) => {
    res.send('Hello Express World!');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
