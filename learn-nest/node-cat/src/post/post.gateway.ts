import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { IsLoggedInGuard } from '../auth/is-logged-in.guard';
import { UseGuards } from '@nestjs/common';
import { User } from '../auth/user.decorator';
/*
websocket gateway는 웹소켓 서버를 만들기 위해 사용하는 NestJS의 기능입니다.
$ npm i @nestjs/websockets @nestjs/platform-socket.io
$ nest g ga post 

게이트웨이는 컨트롤러와 다르게 생겼다. @Controller() 대신 @WebSocketGateway() 데코레이터를 사용하고, @Get(), @Post() 대신 @SubscribeMessage() 데코레이터를 사용한다.
클라이언트에서 웹 소켓을 사용해서 서버로 message라는 이름의 메시지를 보내면 handleMessage() 메서드가 실행된다.
handleMessage() 메서드는 클라이언트에서 보낸 메시지와 클라이언트 객체를 매개변수로 받는다.
⚠️ 웹 소켓 환경에서는 요청/응답 객체가 없고, 에러 발생 시에도 HttpException 대신 WsException이 발생한다. 따라서 가드나 예외 필터 코드도 WsException을 처리할 수 있도록 수정해야 한다.
*/
@WebSocketGateway({ transports: ['websocket'] })
// Socket.IO는 먼저 폴링 방식으로 연결을 시도하고, 이후에 웹소켓으로 업그레이드하는 방식으로 동작한다. transports 옵션을 ['websocket']으로 설정하면 폴링 방식을 사용하지 않고 바로 웹소켓으로 연결한다.
// 소켓은 HTTP 서버와 동일한 포트로 연결을 할 수 있다. 현재 포트가 8088이므로 웹 소켓도 8088 포트로 연결된다. 바꾸고 싶으면 첫 번째 인수에 포트 번호를 입력하면 된다.
export class PostGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly postService: PostService) {}

  @WebSocketServer() server!: Server; // 현재 웹 소켓 서버에 대한 정보를 가져오는 역할을 한다. this.server.emit 메서드를 호출하면 현재 서버에 연결된 모든 클라이언트에게 메시지를 전송한다.

  handleConnection(client: Socket) {
    console.log(`클라이언트 연결됨 : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`클라이언트 연결 끊김 : ${client.id}`);
  }

  @UseGuards(IsLoggedInGuard)
  @SubscribeMessage('createPost')
  async handleCreatePost(
    @User() userId: string,
    @MessageBody() data: { post: CreatePostDto },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const newPost = await this.postService.create(data.post, userId);

      // 모든 연결된 클라이언트에게 새로운 포스트 알림
      this.server.emit('newPost', {
        ...newPost,
        message: '새로운 게시물이 생성되었습니다.',
        timestamp: new Date().toISOString(),
      });

      // 요청한 클라이언트에게 성공 응답
      client.emit('postCreated', { success: true, post: newPost });
    } catch (error) {
      client.emit('error', { message: '게시물 생성 중 오류가 발생했습니다.' });
    }
  }
}
