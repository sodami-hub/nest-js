import express from 'express';

const router = express.Router();

// Get '/user' router
router.get('/', (req, res) => {
    res.send('Hello User');
});

/* Get '/user/:id' router
    '/user/123?name=lee' => req.params = { id: '123' }, req.query = { name: 'lee' }
    ⚠️ 일반 라우터보다 뒤에 위치해야 된다. 와일드 카드 역할을 하기 때문이다.
*/
router.get('/:id', (req, res) => {
    console.log(req.params, req.query);
    const msg = `Hello User ${req.params.id}  Hello User ${req.query.name}`;
    res.send(msg);
});

/* '/:id' 라우터 다음에 '/like' 라우터가 위치하면 해당 라우터는 실행되지 않는다. 
왜냐하면 '/:id' 라우터가 와일드 카드 역할을 하기 때문이다. 즉 '/like' 는 id=like인 요청으로 인신된다.
*/


export default router;
