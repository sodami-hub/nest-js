import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class LoggingService {
  @OnEvent('user.created')
  async handleUserCreated(event: {
    userId: string;
    name: string;
    createdAt: Date;
  }) {
    console.log('📝 [LoggingService] 사용자 생성 로그 처리 시작');

    // 데이터베이스에 로그 저장 시뮬레이션
    await this.saveUserCreationLog(event);

    // 감사 로그 기록 시뮬레이션
    await this.saveAuditLog('USER_CREATED', event.userId);

    console.log('📝 [LoggingService] 사용자 생성 로그 처리 완료');
  }

  @OnEvent('post.created')
  async handlePostCreated(event: {
    postId: number;
    userId: string;
    content: string;
    createdAt: Date;
  }) {
    console.log('📝 [LoggingService] 게시글 생성 로그 처리 시작');

    // 게시글 생성 로그 저장 시뮬레이션
    await this.savePostCreationLog(event);

    // 콘텐츠 분석 로그 시뮬레이션
    await this.analyzeContent(event.content);

    console.log('📝 [LoggingService] 게시글 생성 로그 처리 완료');
  }

  private async saveUserCreationLog(event: {
    userId: string;
    name: string;
    createdAt: Date;
  }) {
    // 데이터베이스 저장 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(
      `💾 [LoggingService] 사용자 생성 로그 저장: ID=${event.userId}, 이름=${event.name}, 생성일=${event.createdAt.toDateString()}`,
    );
  }

  private async saveAuditLog(action: string, userId: string) {
    // 감사 로그 저장 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 80));
    console.log(
      `🔍 [LoggingService] 감사 로그 저장: 액션=${action}, 사용자 ID=${userId}`,
    );
  }

  private async savePostCreationLog(event: {
    postId: number;
    userId: string;
    content: string;
    createdAt: Date;
  }) {
    // 게시글 로그 저장 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 120));
    console.log(
      `💾 [LoggingService] 게시글 생성 로그 저장: 게시글 ID=${event.postId}, 사용자 ID=${event.userId}, 내용="${event.content}", 생성일=${event.createdAt.toDateString()}`,
    );
  }

  private async analyzeContent(content: string) {
    // 콘텐츠 분석 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 120));
    const hashtags = content.match(/#[^\s#]*/g) || [];
    console.log(
      `🧠 [LoggingService] 콘텐츠 분석 완료: 해시태그 ${hashtags.length}개 발견`,
    );
  }
}
