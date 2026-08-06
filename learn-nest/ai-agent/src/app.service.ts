import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    const port = this.configService.get<number>('port');
    const model = this.configService.get<string>('app.defaultProvider');
    return `${port} 포트에서 서버 실행중입니다. ai-agent 기본 모델: ${model}`;
  }
}
