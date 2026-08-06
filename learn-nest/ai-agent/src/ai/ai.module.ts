import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { OpenAIProvider } from './provider/openai.provider';
/*
$ nest g module ai
$ nest g service ai
*/
@Module({
  providers: [AiService, OpenAIProvider],
})
export class AiModule {}
