import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createOpenAI,
  type OpenAIProvider as OpenAIClient,
} from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import {
  AIMessage,
  AIRsponse,
  AIGenerateOptions,
  IAIProvider,
} from '../interfaces/ai-provider.inferface';

@Injectable()
export class OpenAIProvider implements IAIProvider {
  private openai: OpenAIClient;
  private model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('openai.apiKey');
    this.model = this.configService.get<string>('openai.model') || 'gpt-5.4';

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not defined in the environment variables.',
      );
    }

    this.openai = createOpenAI({
      // createOpenAI 함수는 OpenAI API와 상호작용하기 위한 클라이언트를 생성하는 함수.
      apiKey,
    });
  }

  async generateText(
    messages: AIMessage[],
    options?: AIGenerateOptions,
  ): Promise<AIRsponse> {
    const { text } = await generateText({
      model: this.openai(this.model),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: options?.temperature ?? 0.7,
    });

    return {
      content: text,
      provider: 'openai',
      model: this.model,
    };
  }

  async *streamText(
    messages: AIMessage[],
    options?: AIGenerateOptions,
  ): AsyncIterable<string> {
    const { textStream } = streamText({
      model: this.openai(this.model),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: options?.temperature ?? 0.7,
    });
    // for await...of 구문은 비동기 반복자를 사용하여 비동기적으로 데이터를 처리할 수 있게 해준다.
    // 부분응답(chunk)이 도착할 때마다 바로바로 yield를 통해 호출자에게 전달한다. -> 실시간 텍스트 스트리밍
    for await (const chunk of textStream) {
      yield chunk;
    }
  }
}
