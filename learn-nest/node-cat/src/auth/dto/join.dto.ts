import { IsAlphanumeric, IsString, MinLength } from 'class-validator';

export class JoinDto {
  constructor(id: string, nick: string, password: string) {
    this.id = id;
    this.nick = nick;
    this.password = password;
  }

  @IsString()
  id: string;

  @IsString()
  nick: string;

  @IsAlphanumeric() // 알파벳과 숫자로 이루어진 문자열인지 검즘
  @MinLength(8) // 최소 길이 8 이상인지 검증
  password: string;
}
