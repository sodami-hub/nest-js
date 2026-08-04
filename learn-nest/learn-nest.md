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
* nest g f [이름] : 필터 생성

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

## 핸들러에서 사용할 수 있는 매개변수 정리(네스트 매개변수 데코레이터 vs 익스프레스) 
- @Request(), @Req              / req
- @Response(), @Res             / res
- @Next()                       / next
- @Session()                    / req.session
- @Param(param?: string)
- @Body(param?: string)
- @Query(param?: string)
- @Headers(param?: string)
- @Ip()
- @HostParam()
- @UploadedFile()
- @UploadedFiles()
- 커스텀 데코레이터(dto) 

## 컨트롤러와 서비스
프로바이더 중에서 컨트롤러 핸들러에서 사용하는 프로바이더를 서비스라고 부른다. 핸들러에서 모든 코드를 작성해도 되지만 보통 주요한 비지니스 로직은 서비스로 분리한다. 서비스를 핸들러와 분리하는 데는 중복을 제거한다는 이유도 있지만, 더 중요한 이유가 있다.</br>
클라이언트와의 통신은 HTTP 외에도 웹소켓, GraphQL, gRPC 같은 방법이 있다. 이 방식들은 request, response 객체를 가지고 있지 않다. 웹 소켓은 socket, GraphQL은 resolver 라는 함수, gRPC는 proto 파일을 사용한다.</br>
서버는 클라이언트의 요청이 어떤 형식으로 올지 알 수 없다. 따라서 어떤 형태이든 상관없이 처리해야 되는 비지니스로직을 서비스로 분리한다. 즉 컨트롤러는 요청의 형태에 따라서 비지니스로직에 필요한 내용을 뽑아서 서비스에 전달하는 것이다.</br>
이렇게 처리하면 서비스는 요청의 형태와 상관없이 컨트롤러에서 던져주는 정보를 가지고 요청을 처리할 수 있게 된다.