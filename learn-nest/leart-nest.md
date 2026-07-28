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

