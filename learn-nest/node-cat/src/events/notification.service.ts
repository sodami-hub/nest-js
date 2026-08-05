import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  @OnEvent('user.created')
  async handleUserCreated(event: {
    userId: string;
    name: string;
    createdAt: Date;
  }) {
    console.log('🪧 [NotificationService] 사용자 생성 알림 처리 시작');

    // SMS 발송 시뮬레이션
    await this.sendWelcomeSMS(event.name);

    console.log('🪧 [NotificationService] 사용자 생성 알림 처리 완료');
  }

  @OnEvent('post.created')
  async handlePostCreated(event: {
    postId: number;
    userId: string;
    content: string;
    createdAt: Date;
  }) {
    console.log('🪧 [NotificationService] 게시글 생성 알림 처리 시작');

    // 팔로워들에게 알림 발송 시뮬레이션
    await this.notifyFollowers(event.userId, event.content);

    console.log('🪧 [NotificationService] 게시글 생성 알림 처리 완료');
  }

  private async sendWelcomeSMS(userName: string) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    console.log(
      `📱 [NotificationService] 환영 SMS 발송: ${userName}님, 환영합니다!`,
    );
  }

  private async notifyFollowers(userId: string, postContent: string) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    console.log(
      `📢 [NotificationService] 팔로워 알림 발송: 사용자 ${userId}의 새 게시글 - "${postContent}"`,
    );
  }
}
