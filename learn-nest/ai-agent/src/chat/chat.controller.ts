import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Res,
  HttpStatus,
  HttpException,
  Delete,
} from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../ai/ai.service';

@Controller('api/chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private configService: ConfigService,
    private aiService: AiService,
  ) {}

  /*
  🎈 이 메서드는 비동기제너레이터 함수가 아니다 즉 선언부에 * 이 없어도 된다.
    - 비동기 제너레이터는 함수 내부에서 yield 키워드로 값을 반환하는 경우에 사용한다. 하지만 현재 streamChat()은 yield하지 않고, res.write()를 사용해서 응답을 하고 있다. 따라서 비동기 제너레이터로 선언할 필요가 없다.
    - chatService.chatStream() 메서드는 비동기 함수이지만 반환값이 Promise가 아니라 AsyncIterable 이므로 await을 하지 않는다. 실제 값은 for await...of 루프에서 chunk로 받아서 처리한다.
  */
  @Post('stream')
  async streamChat(
    @Body() chatMessageDto: ChatMessageDto,
    @Res() res: Response,
  ) {
    const sessionId =
      chatMessageDto.sessionId || this.chatService.generateSessionId();
    try {
      // SSE(Sever-Sent Events) 헤더 설정
      // SSE는 서버가 하나의 HTTP 연결을 유지하면서 클라이언트에 데이터를 계속 전송하는 방식이다. 즉, 요청 한번에 응답 한번이 아니라, 요청 한 번으로 연결을 열어두고 서버거 여러 번 데이터를 보내는 방식이다.
      // res.end()를 하기 전까지는 연결이 유지된다.
      res.setHeader('Content-Type', 'text/event-stream'); // 응답이 SSE 형식임을 나타냄
      res.setHeader('Cache-Control', 'no-cache'); // 중간 캐시가 이벤트를 저장하지 않도록 설정
      res.setHeader('Connection', 'keep-alive'); // 연결을 닫지 않고 유지

      // 스트리밍 시작
      const stream = this.chatService.chatStream(
        sessionId,
        chatMessageDto.message,
        chatMessageDto.provider,
      );

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ chunk, sessionId })}\n\n`); // SSE에서는 빈 줄 하나가 이벤트의 끝을 나타낸다. 따라서 \n\n을 사용하여 이벤트를 구분한다.
      }
      res.write(`data: ${JSON.stringify({ done: true, sessionId })}\n\n`);
      res.end();
      // typescript 는 catch 블록에서 error의 값이 항상 Error객체라고 보장할 수 없어서 error 타입을 unknown으로 추론한다.
      // 따라서 error를 Error로 단언(assertion)해야 한다. error as Error 또는 아래와 같이
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.';
      res.write(`data: ${JSON.stringify({ errorMessage, sessionId })}\n\n`);
      res.end();
    }
  }

  @Get('providers')
  getProbiders() {
    const availableProviders = this.aiService.getAvailableProviders();

    // 프로바이더 표시 이름 매핑
    const providerDisplayNames: Record<string, string> = {
      openai: 'GPT-5',
      claude: 'Claude',
      gemini: 'Gemini',
    };

    const providers = availableProviders.map((provider) => ({
      value: provider,
      label: providerDisplayNames[provider] || provider,
    }));

    return {
      providers,
      default:
        this.configService.get<string>('app.defaultProvider') || 'openai',
    };
  }

  @Get('history/:sessionId')
  getHistory(@Param('sessionId') sessionId: string) {
    const messages = this.chatService.getSessionMessages(sessionId);
    return {
      sessionId,
      messages,
      count: messages.length,
    };
  }

  @Delete('session/:sessionId')
  clearSession(@Param('sessionId') sessionId: string) {
    const success = this.chatService.clearSession(sessionId);

    if (!success) {
      throw new HttpException('session not found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'session cleared',
      sessionId,
    };
  }
}
