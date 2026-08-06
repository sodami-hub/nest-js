import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule], // chat.service.ts, chat.controller.ts에서 AiService를 사용하기 위해 AiModule을 import
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
