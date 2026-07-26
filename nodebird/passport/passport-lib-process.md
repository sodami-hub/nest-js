# passport 동작 과정
## 로그인
1. /auth/login 라우터를 통해 로그인 요청이 들어옴
2. 라우터에서 passport.authenticate 메서드 호출
3. 로그인 전략(LocalStrategy) 수행
4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
5. req.login 메서드가 passport.serializeUser 호출
6. serializeUser는 사용자 아이디와 함께 done 호출
7. req.session에 사용자 아이디만 저장해서 세션 생성
8. express-session에 설정한 대로 브라우저에 세션 쿠키(기본 이름 connect.sid) 전송
9. 로그인 완료
## 로그인 이후
1. 요청이 들어옴
2. 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 요청에 들어 있는 세션 쿠키를 읽고 세션 객체를 찾아서 req.session으로 만듦
3. req.session에 저장된 아이디와 함께 passport.deserializeUser 메서드 호출
4. deserializeUser는 데이터베이스에서 사용자 조회
5. 조회된 사용자 정보를 done 으로 보내 req.user에 저장
6. 라우터에서 req.user 객체 사용 가능