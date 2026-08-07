import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// 채팅 입력 검증을 위한 DTO, 프론트앤드는 이 DTO에 맞춰서 요청을 보내야 한다.
export class ChatMessageDto {
  @ApiProperty({
    description: '사용자가 입력한 메시지, 최대 2000자',
    example: '안녕하세요, 오늘 날씨 어때요?',
    maxLength: 2000,
  }) // Swagger 문서에 표시될 필드
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message!: string;

  @ApiPropertyOptional({
    description: '사용할 AI 프로바이더, openai, claude, gemini 중 하나',
    example: 'openai',
    enum: ['openai', 'claude', 'gemini'],
  }) // Swagger 문서에 표시될 필드
  @IsString()
  @IsOptional()
  @IsIn(['openai', 'claude', 'gemini'])
  provider?: string;

  @ApiPropertyOptional({
    description:
      '세션 아이디, 같은 대화에는 동일한 세션 아이디를 지정해야 된다.',
    example: 'sessionId_1234567890',
  }) // Swagger 문서에 표시될 필드
  @IsString()
  @IsOptional()
  sessionId?: string; // 세션관리를 위한 필드, 같은 대화에는 동일한 세션 아이디를 지정해야 된다.
}
