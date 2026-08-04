import {
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Redirect,
  Inject,
  Body,
  Param,
  Get,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { IsLoggedInGuard } from '../auth/is-logged-in.guard';
import multer from 'multer';
import { posts, hashtags, postsToHashtags } from '../drizzle/schema';
import * as schema from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { User } from '../auth/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';

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
  constructor(
    private readonly postService: PostService,
    @Inject('DRIZZLE')
    private readonly db: MySql2Database<typeof schema>,
  ) {}

  /*
  @Param@, @Body(), @Query() 로 받아온 개별 속성의 자료형은 전부 문자열이다. 숫자로 사용하고 싶다면 parseInt()로 변환해야 한다.
  ✨ 이런 상황에서 ParseIntPipe를 사용하면 @Param('id', ParseIntPipe) id: number 처럼 바로 숫자로 받을 수 있다.
  ParseIntPipe 외에도 ParseBoolPipe, ParseArrayPipe, ParseUUIDPipe, ParseDatePipe, ParseEnumPipe, ValidationPipe, DefaultValuePipe, CustomPipe 등 다양한 파이프가 있다.
  🎈 또한 url에 parseInt 할 수 없는 문자열을 넣는다면 에러가 발생한다. ParseIntPipe는 데이터를 원하는 자료형으로 변환하기도 하지만 데이터가 형식에 맞는지 검증하는 역할도 한다.
  */
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
  }

  /*
  🙌 아래 핸들러를 보면 content, url 값을 각각 @Body() 로 받아오고 있다. 이런식으로 개별적으로 받아오고 검사해도 되지만(검사하는 부분은 아직 미구현)
  속성이 두 개 이상일 때부터는 클래스를 사용하여 검증/변환하는 것이 편리하다. 클래스를 통해 검사해보겠다.
  🎈 class-validator, class-transformer 패키지를 설치하고, ./dto/create-post.dto.ts 에서 CreatePostDto 클래스를 만들어 content, url 속성을 정의하고,
  @Body()에 CreatePostDto를 넣어주면 된다.
  */
  @UseGuards(IsLoggedInGuard)
  @UseInterceptors(NoFilesInterceptor())
  @UsePipes(new ValidationPipe({ transform: true })) // 핸들러에 @UsePipes() 데코레이터를 사용해서 파이프를 한번에 장착할 수 있다.
  @Redirect('/')
  @Post()
  uploadPost(
    @Body(new ValidationPipe({ transform: true })) body: CreatePostDto, // dto에 @Transform() 데코레이터를 사용했기 때문에 ValidationPipe에 transform: true 옵션을 넣어야 한다.
    @User() user: Express.User,
  ) {
    return this.postService.create(body, user.id);
  }

  @UseGuards(IsLoggedInGuard)
  @UseInterceptors(
    FileInterceptor('img', {
      limits: { fileSize: 5 * 1024 * 1024 },
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = file.originalname.split('.').pop();
          cb(null, `${Date.now()}.${ext}`);
        },
      }),
    }),
  )
  @Post('img')
  uploadPostImg(@UploadedFile() file: Express.Multer.File) {
    return { url: `/img/${file.filename}` };
  }
}
