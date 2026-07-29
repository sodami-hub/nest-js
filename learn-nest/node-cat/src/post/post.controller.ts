import { Controller, Post, UseInterceptors, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { IsLoggedInGuard } from '../auth/is-logged-in.guard';
import multer from 'multer';

/*
👍인터셉터!!
네스트 요청의 생애 주기 nodecat/learn-nest.md 의 그림2를 보면 알 수 있다.
1. 미들웨어 실행
2. 가드 실행(@UseGuards)
3. 인터셉터 컨트롤러 이전 부분 실행
4. 파이프 실행(@Body(), @Param() 등)
5. 컨트롤러 핸들러(@Get(), @Post() 등) 실행
6. 인터셉터 컨트롤러 이후 부분 실행
7. 2~6 과정에서의 예외 발생 시 예외 필터 실행

네스트는 @nestjs/platform-express 안에 FileInterceptor, FilesInterceptor, FileFieldsInterceptor, NoFilesInterceptor 를 갖고 있다.
각각 익스프레스 멀터의 upload.single(), upload.array(), upload.fields(), upload.none() 에 대응된다.
@Controller() 위에 붙여 모든 핸들러에 적용할 수도 있다.
*/
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(IsLoggedInGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post()
  uploadPost() {}

  @UseGuards(IsLoggedInGuard)
  @UseInterceptors(
    FileInterceptor('img', {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = file.originalname.split('.').pop();
          cb(null, `${Date.now()}.${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Post('img')
  uploadPostImg() {}
}
