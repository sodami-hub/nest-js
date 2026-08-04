import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostGateway } from './post.gateway';

@Module({
  controllers: [PostController],
  providers: [PostService, PostGateway], // PostGateway를 providers에 추가, gateway는 컨트롤러와 다르게 providers에 등록해야 한다.
})
export class PostModule {}
