import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { OpenAIProvider } from './provider/openai.provider';
import { ClaudeProvider } from './provider/claude.provider';
import { GeminiProvider } from './provider/gemini.provider';
/*
$ nest g module ai
$ nest g service ai
*/
@Module({
  providers: [AiService, OpenAIProvider, ClaudeProvider, GeminiProvider],
  exports: [AiService], // AiService를 외부 모듈에서 사용할 수 있도록 export : chat.module.ts에서 AiService를 사용하기 위해서 AiModule을 import 하도록 한다.
})
export class AiModule {}
