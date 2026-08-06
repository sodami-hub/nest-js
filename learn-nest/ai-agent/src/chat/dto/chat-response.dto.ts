// 서버의 응답 DTO
export class ChatResponseDto {
  message!: string; //AI가 생성한 응답 메시지
  provider!: string; // 사용된 ai 프로바이더와 모델명
  model!: string;
  timestamp!: Date;
  usage?: {
    // 토큰 사용량 정보
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
