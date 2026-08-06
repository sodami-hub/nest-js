/* ai-provider.inferface.ts : AI Provider 시스템의 핵심
AIMessage : 대화 메시지 클라이언트가 입력하는 메시지의 role은 user, AI의 응답의 role은 assistant가 된다.
AIResponse : AI의 응답 메시지, provider는 어떤 AI Provider를 사용했는지, model은 어떤 모델을 사용했는지, usage는 토큰 사용량
IAIProvider : 모든 AI 프로바이더가 구현해야 하는 공통 메서드의 정의. Vercel AI SDK 덕분에 OpenAI, Anthropic, Gemini 서비스를 동일한 인터페이스로 사용할 수 있다.
  - generateText : 일반 텍스트 생성 - ai의 응답이 완성되어야 서버로 응답을 전송
  - streamText : 스트리밍 텍스트 생성 - ai가 일부만 응답해도 바로바로 서버로 전송하는 메서드
*/
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIRsponse {
  content: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface IAIProvider {
  generateText(
    messages: AIMessage[],
    options?: AIGenerateOptions,
  ): Promise<AIRsponse>;

  streamText(
    messages: AIMessage[],
    options?: AIGenerateOptions,
  ): AsyncIterable<string>;
}
