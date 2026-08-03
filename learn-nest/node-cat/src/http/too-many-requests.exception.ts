import { HttpException, HttpExceptionOptions } from '@nestjs/common';

// HttpException를 상속받아 TooManyRequestsException 클래스를 정의
export class TooManyRequestsException extends HttpException {
  constructor(message?: string, options?: HttpExceptionOptions) {
    super(message || 'Too many requests', 429, options);
  }
}
