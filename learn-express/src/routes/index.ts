import express from 'express';

const router = express.Router();

// 첫번째 라우터의 첫 번째 미들웨어에서 next() 대신 next('route')를 호출하면, 다음 라우터로 이동한다.
// 즉, 첫번째 라우터의 두,세번째 미들웨어를 건너띄고 두번째 라우터의 첫 번째 미들웨어로 이동한다.
router.get('/', (req,res,next) => {
    next('route');
}, (req, res ,next) => {
    console.log('두번째 미들웨어 실행되지 않음');
    next();
}, (req, res ,next) => {
    console.log('세번째 미들웨어 실행되지 않음');
    next();
});


// Get '/' router
router.get('/', (req,res) => {
    // 템플릿 엔진을 사용해서 응답을 보내려면 res.render() 사용.
    // 지정한 views 폴더를 기준으로 템플릿 파일을 찾는다. (../views/index.html)  
    // 두번째 인수는 값을 템플릿 엔진으로 보내고, 보낸 값은 넌적스의 변수와 연결된다.
    res.render('index', { title: 'Express' });
})

/*---------------------------
router.get('/main', (req,res) => {
    res.send('GET /main');
});

router.post('/main', (req, res) => {
    res.send('POST /main');
})
*/ 
// ------- 위와 같이 주소는 같지만 메서드가 다른 코드를 router.route를 사용해서 하나의 덩어리로 합친다.
router.route('/main')
    .get((req,res) => {
        res.send('GET /main');
    })
    .post((req, res) => {
        res.send('POST /main');
    });


export default router;
