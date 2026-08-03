import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  constructor(content: string, url?: string) {
    this.content = content;
    this.url = url;
  }

  // Transform dto 클래스의 값을 변환하는 역할을 한다. 변환 기능을 사용하기 위해서는 ValidationPipe의 연결 방식도 수정해야 한다.
  @IsString() // 해당 속성이 문자열임을 검사
  @Transform(({ value }) => value.trim()) // 문자열 앞뒤 공백 제거
  content: string;

  @IsString()
  @IsOptional() // 해당 속성이 필수가 아님을 나타냄
  @Transform(({ value }) => value?.trim()) // 문자열 앞뒤 공백 제거
  url?: string;
}
