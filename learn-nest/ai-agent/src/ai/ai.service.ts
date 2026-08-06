import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIProvider } from './provider/openai.provider';
import { ClaudeProvider } from './provider/claude.provider';
import { GeminiProvider } from './provider/gemini.provider';
import {
  IAIProvider,
  AIMessage,
  AIRsponse,
  AIGenerateOptions,
} from './interfaces/ai-provider.inferface';

/*
✨ AiService : 여러 AI Provider를 관리하는 중앙 서비스.
*/

@Injectable()
export class AiService {
  private providers: Map<string, IAIProvider> = new Map();
  private defaultProvider: string;

  constructor(
    private configService: ConfigService,
    private openAIProvider: OpenAIProvider,
    private claudeProvider: ClaudeProvider,
    private geminiProvider: GeminiProvider,
  ) {
    this.defaultProvider =
      this.configService.get<string>('app.defaultProvider') || 'openai';

    // Provider 등록
    this.providers.set('openai', this.openAIProvider);
    this.providers.set('claude', this.claudeProvider);
    this.providers.set('gemini', this.geminiProvider);
  }

  async generateText(
    messages: AIMessage[],
    provider?: string,
    options?: AIGenerateOptions,
  ): Promise<AIRsponse> {
    const selectedProvider = this.getProvider(provider);
    return selectedProvider.generateText(messages, options);
  }

  async *streamText(
    messages: AIMessage[],
    provider?: string,
    options?: AIGenerateOptions,
  ): AsyncIterable<string> {
    const selectedProvider = this.getProvider(provider);
    yield* selectedProvider.streamText(messages, options);
  }

  private getProvider(providerName?: string): IAIProvider {
    const name = providerName || this.defaultProvider;
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`AI Provider ${name} is not registered.`);
    }
    return provider;
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
