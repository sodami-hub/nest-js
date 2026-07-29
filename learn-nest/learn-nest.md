# init nest project
```
# nestjs의 cli 패키지를 전역으로 설치한다.
$ npm i -g @nestjs/cli 

# nest project를 node-cat 디렉터리에 설치한다. [git 관련 설정 스킵]
$ nest new node-cat [--skit-git]

```
* nest g mo [파일이름] : 모듈 파일을 추가하는 명령어
* nest g co [파일이름] : 컨트롤러 추가하는 명령어
* nest g s [파일이름] : 서비스(프로바이더) 추가하는 명령어
* nest g res [파일이름] : 모듈,컨트롤러, 서비스를 세트로 추가하는 명령어
* nest g gu [파일이름] : 가드를 추가하는 명령어
* nest g mi [파일이름] : 미들웨어를 추가하는 명령어

![그림 01](./temp/image.png "auth를 추가한 상태의 프로젝트 구조") 

# 네스트의 요청 생애 주기
![그림 02](./temp/0001.jpg "네스트 요청의 생애 주기")

1. 미들웨어 실행
2. 가드 실행(@UseGuards)
3. 인터셉터 컨트롤러 이전 부분 실행
4. 파이프 실행(@Body(), @Param() 등)
5. 컨트롤러 핸들러(@Get(), @Post() 등) 실행
6. 인터셉터 컨트롤러 이후 부분 실행
7. 2~6 과정에서의 예외 발생 시 예외 필터 실행

## 순환참조 발생시 `🎈forwardRef`
순환참조가 발생하는 의존성의 어느 한쪽의 생성자에 `@Inject(forwardRef(()=>['참조대상']))` 처리를 한다.