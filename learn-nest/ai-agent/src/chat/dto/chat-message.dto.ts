import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsIn,
} from 'class-validator';

// 채팅 입력 검증을 위한 DTO, 프론트앤드는 이 DTO에 맞춰서 요청을 보내야 한다.

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message!: string;

  @IsString()
  @IsOptional()
  @IsIn(['openai', 'claude', 'gemini'])
  provider?: string;

  @IsString()
  @IsOptional()
  sessionId?: string; // 세션관리를 위한 필드, 같은 대화에는 동일한 세션 아이디를 지정해야 된다.
}
