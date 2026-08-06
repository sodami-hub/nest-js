import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../ai/ai.service';
import { AIMessage } from '../ai/interfaces/ai-provider.inferface';

export interface ChatSession {
  id: string;
  messages: AIMessage[];
  createdAt: Date;
  lastActivity: Date;
}

@Injectable()
export class ChatService {
  private sessions: Map<string, ChatSession> = new Map();
  private maxHistoryLength: number;

  constructor(
    private aiService: AiService,
    private configService: ConfigService,
  ) {
    this.maxHistoryLength = this.configService.get<number>(
      'app.maxHistory.length',
      10,
    );
  }

  getOrCreateSession(sessionId?: string): ChatSession {
    if (!sessionId) {
      sessionId = this.generateSessionId();
    }

    let session = this.sessions.get(sessionId);

    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        lastActivity: new Date(),
      };
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  addMessage(sessionId: string, message: AIMessage): void {
    const session = this.getOrCreateSession(sessionId);
    session.messages.push(message);
    session.lastActivity = new Date();

    // 히스토리 길이 제한
    if (session.messages.length > this.maxHistoryLength * 2) {
      session.messages = session.messages.slice(-this.maxHistoryLength * 2); // 오래된 메시지 제거
    }
  }

  getSessionMessages(sessionId: string): AIMessage[] {
    const session = this.sessions.get(sessionId);
    return session ? [...session.messages] : [];
  }
  // '*' 이 메서드를 일반 비동기 함수가 아닌 비동기 제너레이터로 선언한다는 의미
  // AsyncIterable<string> : 문자열을 비동기적으로 여러 번 나눠서 전달한다는 반환 타입
  async *chatStream(
    sessionId: string,
    userMessage: string,
    provider?: string,
  ): AsyncIterable<string> {
    //사용자 메시지 추가
    const userMsg: AIMessage = {
      role: 'user',
      content: userMessage,
    };
    this.addMessage(sessionId, userMsg);

    // AI 응답 스트리밍
    const messages = this.getSessionMessages(sessionId);
    let fullResponse = '';

    /*
      { value: '첫 번째 조각', done: false }
      { value: '두 번째 조각', done: false }
      { value: undefined, done: true }

      마지막의 done: true를 받으면 반복이 종료됩니다.
    */
    for await (const chunk of this.aiService.streamText(messages, provider)) {
      fullResponse += chunk;
      yield chunk; // 클라이언트로 스트리밍
    }
    // AI 응답 저장
    const assistantMsg: AIMessage = {
      role: 'assistant',
      content: fullResponse,
    };
    this.addMessage(sessionId, assistantMsg);
  }

  generateSessionId(): string {
    /*
  - session_: 세션 ID임을 나타내는 접두사
  - Date.now(): 현재 시각을 밀리초 단위 숫자로 반환
  - Math.random(): 0 이상 1 미만의 난수 생성
  - .toString(36): 난수를 숫자와 영문 소문자로 구성된 36진수 문자열로 변환
  - .slice(2, 11): 앞의 0.을 제외하고 최대 9글자를 추출
  */
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}
