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


# LocalStrategy / KakaoStrategy 의 로직 구분
• 이 프로젝트에서 Passport는 크게 세 가지 역할을 합니다.

  1. Local/Kakao 전략을 통해 사용자를 인증한다.
  2. 인증 성공 사용자를 세션에 로그인시킨다.
  3. 이후 요청에서 세션의 사용자 ID를 실제 사용자 객체로 복원한다.

  가장 중요한 점은 각 위치에 등장하는 done이 개발자가 직접 만든 함수가 아니라, Passport가 콜백 인자로
  넣어주는 함수라는 것입니다. 그리고 전략의 done과 serializeUser/deserializeUser의 done은 이름만 같을
  뿐 서로 다른 목적의 콜백입니다.

  ## 1. Passport 초기 설정

  앱이 시작될 때 passportConfig()가 호출되어 다음을 등록합니다.

  - serializeUser
  - deserializeUser
  - LocalStrategy
  - KakaoStrategy

  그리고 Express 세션 다음에 Passport 미들웨어가 연결됩니다.

  express-session
      ↓
  passport.initialize()
      ↓
  passport.session()
      ↓
  라우터

  코드: app.ts:30, passport/index.ts:8

  express-session이 먼저 있어야 Passport가 req.session에 로그인 정보를 저장할 수 있습니다.

  ———

  ## 2. 로컬 회원가입 흐름

  회원가입 자체에는 Passport를 사용하지 않습니다.

  POST /auth/join
   → isNotLoggedIn
   → join 컨트롤러
   → 동일 ID 조회
   → bcrypt.hash(password, 12)
   → users 테이블 저장
   → /

  코드: routes/auth.ts:8, controllers/auth.ts:10

  즉, 회원가입이 끝났다고 자동 로그인되지는 않습니다. 사용자가 별도로 로그인해야 합니다.

  ———

  ## 3. Local 로그인 흐름

  전체 흐름은 다음과 같습니다.

  POST /auth/login
   → isNotLoggedIn
   → login 컨트롤러
   → passport.authenticate('local', 사용자 정의 콜백)
   → LocalStrategy 검증 콜백
   → done(error, user, info)
   → authenticate에 전달한 사용자 정의 콜백
   → req.login(user)
   → serializeUser(user)
   → req.session.passport.user에 user.id 저장
   → 응답 리다이렉트

  ### 3-1. 로그인 요청

  라우터는 login 컨트롤러를 호출합니다.

  router.post('/login', isNotLoggedIn, login);

  isNotLoggedIn은 req.isAuthenticated()를 확인해서 이미 로그인한 사용자의 재로그인을 막습니다.

  코드: routes/auth.ts:11, middlewares/index.ts:17

  ### 3-2. passport.authenticate() 실행

  컨트롤러는 다음과 같이 authenticate를 호출합니다.

  passport.authenticate(
      'local',
      (authError, user, info) => {
          // 인증 결과 처리
      },
  )(req, res, next);

  코드: controllers/auth.ts:35

  passport.authenticate()는 Express 미들웨어 함수를 반환합니다. 따라서 반환된 미들웨어를 현재 요청에 바
  로 실행하기 위해 마지막에 (req, res, next)를 붙인 것입니다.

  개념적으로는 다음과 같습니다.

  const authenticateMiddleware = passport.authenticate('local', callback);
  authenticateMiddleware(req, res, next);

  ### 3-3. LocalStrategy 실행

  Passport는 등록된 'local' 전략을 찾아 실행합니다.

  new LocalStrategy(
      {
          usernameField: 'id',
          passwordField: 'password',
          passReqToCallback: false,
      },
      async (id, password, done) => {
          // 사용자 인증
      },
  );

  코드: passport/localStrategy.ts:17

  usernameField: 'id'이기 때문에 Passport는 다음 값을 꺼내 전략 콜백에 전달합니다.

  req.body.id       → id
  req.body.password → password
  Passport 내부 함수 → done

  passReqToCallback이 false이므로 req는 전략 콜백에 전달되지 않습니다.

  ### 3-4. DB 및 비밀번호 검증

  LocalStrategy에서는 다음 순서로 검증합니다.

  id로 사용자 조회
   ├─ 사용자 없음 → done(null, false, 가입되지 않은 회원)
   └─ 사용자 있음
       ├─ bcrypt.compare 성공 → done(null, user)
       └─ 비교 실패 → done(null, false, 비밀번호 불일치)

  코드: passport/localStrategy.ts:23

  ———

  ## 4. LocalStrategy의 done은 어디로 전달되는가

  LocalStrategy 검증 콜백의 done은 Passport가 만들어서 전달한 함수입니다.

  async (id, password, done) => {
      done(null, exUser[0], undefined);
  }

  이 호출이 컨트롤러 콜백을 직접 호출하는 것처럼 보이지만, 실제로는 Passport 내부를 한 번 거칩니다.

  LocalStrategy 검증 콜백
      │
      │ done(error, user, info)
      ▼
  Passport LocalStrategy 내부
      │
      │ this.success(user, info)
      │ this.fail(info)
      │ this.error(error)
      ▼
  passport.authenticate 내부
      │
      ▼
  컨트롤러가 authenticate에 넘긴 콜백
  (authError, user, info)

  인자 대응은 다음과 같습니다.

   전략의 호출                컨트롤러 콜백에서 받는 값        의미
  ━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━
   done(null, user)           (null, user, undefined)          인증 성공
  ─────────────────────────  ───────────────────────────────  ────────────────────
   done(null, false, info)    (null, false, info)              정상적인 인증 실패
  ─────────────────────────  ───────────────────────────────  ────────────────────
   done(error)                (error, undefined, undefined)    시스템 오류

  즉 다음 두 부분이 논리적으로 연결됩니다.

  // LocalStrategy
  done(null, exUser[0], undefined);

  // controllers/auth.ts
  (authError, user, info) => {
      // authError = null
      // user = exUser[0]
      // info = undefined
  }

  다만 done이 컨트롤러 콜백 그 자체는 아닙니다. done이 Passport 내부의 성공·실패 처리를 호출하고,
  Passport가 그 결과로 컨트롤러 콜백을 호출합니다.

  ### 인증 실패와 시스템 오류의 차이

  비밀번호 불일치나 미가입은 서버 장애가 아니라 정상적인 인증 실패입니다.

  done(null, false, {
      message: '비밀번호가 일치하지 않습니다.',
  });

  그래서 컨트롤러의 !user 분기로 전달됩니다.

  if (!user) {
      return res.redirect(`/?loginError=${info?.message}`);
  }

  반면 DB 오류 등은 다음과 같이 전달합니다.

  done(error, false, undefined);

  그러면 authError 분기에서 Express 에러 미들웨어로 전달됩니다.

  if (authError) {
      return next(authError);
  }

  ———

  ## 5. Local 로그인에서 req.login()이 필요한 이유

  이 프로젝트는 Local 인증에 사용자 정의 authenticate 콜백을 사용하고 있습니다.

  passport.authenticate('local', (authError, user, info) => {
      // ...
  });

  Passport에서는 사용자 정의 콜백을 전달하면 성공·실패 이후 처리를 개발자가 직접 담당합니다. 따라서 인
  증 성공만으로는 세션 로그인이 완료되지 않고, 명시적으로 다음을 호출해야 합니다.

  req.login(user, callback);

  코드: controllers/auth.ts:50

  req.login()은 내부적으로 serializeUser를 호출합니다.

  req.login(user)
   → passport.serializeUser(user, done)
   → done(null, user.id)
   → req.session.passport.user = user.id

  등록된 직렬화 함수는 다음과 같습니다.

  passport.serializeUser((user, done) => {
      done(null, user.id);
  });

  코드: passport/index.ts:15

  여기에서는 전체 사용자 객체 대신 ID만 세션에 저장합니다. 개념적인 세션 모양은 다음과 같습니다.

  req.session = {
      passport: {
          user: '사용자 ID',
      },
  };

  여기서 req.login의 콜백은 또 다른 콜백입니다.

  req.login(user, (loginError) => {
      // serializeUser와 세션 저장까지 완료된 후 호출
  });

  전략의 done 결과를 받는 콜백이 아니라, 실제 세션 로그인 완료 여부를 받는 콜백입니다.

  ———-----------------

  ## 6. ✨Kakao 로그인 및 자동 회원가입 흐름

  Kakao는 OAuth 기반이어서 요청이 두 번 발생합니다.

  1차 요청: GET /auth/kakao
   → Kakao 인증 페이지로 리다이렉트

  사용자가 Kakao에서 로그인 및 동의

  2차 요청: GET /auth/kakao/callback?code=...
   → code를 access token으로 교환
   → Kakao 프로필 조회
   → KakaoStrategy 검증 콜백
   → 기존 사용자 조회 또는 신규 사용자 생성
   → done(null, user)
   → Passport가 자동으로 req.login(user)
   → serializeUser
   → 세션 저장
   → 다음 라우터에서 /

  ### 6-1. 최초 Kakao 인증 요청

  router.get('/kakao', passport.authenticate('kakao'));

  코드: routes/auth.ts:17

  여기서는 아직 KakaoStrategy의 검증 콜백이 실행되지 않습니다. Passport가 사용자를 Kakao 로그인 페이지
  로 보내는 단계입니다.

  ### 6-2. Kakao 콜백 요청

  인증이 끝나면 Kakao가 브라우저를 다음 주소로 돌려보냅니다.

  /auth/kakao/callback?code=인가코드

  이 요청은 다음 라우터가 처리합니다.

  router.get(
      '/kakao/callback',
      passport.authenticate('kakao', {
          failureRedirect: '/?loginError=카카오로그인실패',
      }),
      (req, res) => {
          res.redirect('/');
      },
  );

  코드: routes/auth.ts:20

  Passport-kakao가 내부적으로 인가 코드를 토큰으로 교환하고 프로필을 얻은 뒤 검증 콜백을 호출합니다.

  async (accessToken, refreshToken, profile, done) => {
      // ...
  }

  코드: passport/kakaoStrategy.ts:20

  ### 6-3. 기존 사용자 조회 또는 회원가입

  Kakao 사용자 ID와 provider = 'kakao'로 사용자를 조회합니다.

  기존 Kak카오 사용자 있음
   → done(null, exUser[0])

  기존 사용자 없음
   → users 테이블에 가입 정보 저장
   → 저장된 사용자 재조회
   → done(null, newUser[0])

  코드: passport/kakaoStrategy.ts:23

  따라서 Kakao에서는 별도의 회원가입 URL 없이, 최초 로그인 시 회원가입까지 자동으로 처리됩니다.

  ———

  ## 7. KakaoStrategy의 done은 어디로 전달되는가

  Kakao 라우트의 passport.authenticate()에는 Local처럼 사용자 정의 콜백이 없습니다.

  passport.authenticate('kakao', {
      failureRedirect: '...',
  });

  따라서 done() 결과는 다음 라우트 콜백으로 직접 전달되는 것이 아닙니다. Passport의 기본 인증 처리로 들
  어갑니다.

  KakaoStrategy 검증 콜백
      │
      │ done(null, user)
      ▼
  passport-kakao / OAuth2Strategy 내부
      │
      │ this.success(user)
      ▼
  passport.authenticate 기본 성공 처리
      │
      │ req.logIn(user)
      ▼
  serializeUser(user)
      │
      │ done(null, user.id)
      ▼
  세션 저장
      │
      ▼
  next()
      │
      ▼
  (req, res) => res.redirect('/')

  즉, 라우터 마지막의 (req, res) => res.redirect('/')는 인증 결과를 받는 콜백이 아니라, Passport 인증과
  세션 로그인이 성공하여 next()가 호출된 후 실행되는 일반 Express 미들웨어입니다.

  Local과 비교하면 다음과 같습니다.

   구분                             Local                               Kakao
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   authenticate 사용자 정의 콜백    있음                                없음
  ───────────────────────────────  ──────────────────────────────────  ────────────────────────────────
   전략 done 결과 처리              컨트롤러 콜백으로 전달              Passport 기본 처리
  ───────────────────────────────  ──────────────────────────────────  ────────────────────────────────
   req.login() 호출                 컨트롤러가 직접 호출                Passport가 자동 호출
  ───────────────────────────────  ──────────────────────────────────  ────────────────────────────────
   실패 처리                        컨트롤러가 info.message로 리다이    failureRedirect
                                    렉트
  ───────────────────────────────  ──────────────────────────────────  ────────────────────────────────
   성공 후 이동                     req.login 콜백에서 이동             다음 Express 미들웨어에서 이동

  ———

  ## 8. 로그인 이후 deserializeUser 흐름

  로그인 이후 브라우저가 세션 쿠키를 포함해 요청하면 다음 과정이 매 요청마다 실행됩니다.

  브라우저의 세션 쿠키
   → express-session이 세션 조회
   → req.session.passport.user에서 ID 확인
   → passport.session()
   → deserializeUser(id, done)
   → DB에서 사용자 조회
   → done(null, user)
   → req.user = user
   → 이후 라우터 실행

  구현은 다음과 같습니다.

  passport.deserializeUser(async (id, done) => {
      const user = await db.select(...).where(eq(users.id, id));
      done(null, user[0]);
  });

  코드: passport/index.ts:25

  이곳의 done(null, user)는 전략의 done과 목적이 다릅니다.

  - 전략의 done(null, user): 인증 결과를 Passport에 전달
  - serializeUser의 done(null, id): 세션에 저장할 값을 전달
  - deserializeUser의 done(null, user): req.user에 넣을 값을 전달

  그 결과 다음 메서드들이 동작합니다.

  req.user
  req.isAuthenticated()
  req.isUnauthenticated()

  ———

  ## 9. 로그아웃 흐름

  GET /auth/logout
   → isLoggedIn
   → req.logout(callback)
   → Passport 로그인 상태 제거
   → callback 실행
   → /

  코드: routes/auth.ts:14, controllers/auth.ts:61

  req.logout()은 Passport가 관리하는 req.user와 세션의 Passport 사용자 정보를 제거합니다. 현재 구현은
  Passport 로그인 정보만 해제하며, express-session 세션 전체를 destroy()하거나 브라우저 쿠키를 명시적으
  로 삭제하지는 않습니다.

  ## 핵심만 한 문장으로 정리

  LocalStrategy의 done은 authenticate('local', customCallback)의 사용자 정의 콜백으로 결과가 이어지고,
  그 콜백이 req.login()을 호출합니다. 반면 KakaoStrategy의 done은 사용자 정의 콜백이 없으므로 Passport
  의 기본 성공 처리로 이어져 req.login()과 serializeUser()가 자동 실행됩니다.