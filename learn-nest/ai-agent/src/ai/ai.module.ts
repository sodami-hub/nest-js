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
})
export class AiModule {}
