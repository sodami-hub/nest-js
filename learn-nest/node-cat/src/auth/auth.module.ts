import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';
import { KakaoStrategy } from './kakao.strategy';

@Module({
  imports: [ConfigModule.forRoot(), PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, LocalSerializer, LocalStrategy, KakaoStrategy],
})
export class AuthModule {}
