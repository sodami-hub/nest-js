import { Module, DynamicModule } from '@nestjs/common';
import { DrizzleMySqlService, DrizzleMySqlConfig } from './drizzle.service';

interface DrizzleModuleConfig {
  useFactory: (...args: any[]) => DrizzleMySqlConfig;
  inject?: any[];
  isGlobal?: boolean;
}

@Module({})
export class DrizzleModule {
  // forRootAsync : 비동기적으로 모듈을 설정할 수 있는 메서드로, provider를 통해 DrizzleMySqlConfig를 제공받아 DrizzleMySqlService를 생성한다.
  static forRootAsync(provider: DrizzleModuleConfig): DynamicModule {
    return {
      module: DrizzleModule,
      global: provider.isGlobal ?? false,
      providers: [
        DrizzleMySqlService,
        {
          ...provider, // app.module.ts에서 DrizzleModule 설정을 통해 받아온다.
          provide: 'DRIZZLE_MYSQL_CONFIG', //provider를 통해 DrizzleMySqlConfig를 제공받아 'DRIZZLE_MYSQL_CONFIG'라는 이름(프로바이더의 이름)으로 등록한다.
        },
        {
          provide: 'DRIZZLE', // provider의 이름
          useFactory: (
            drizzleService: DrizzleMySqlService,
            config: DrizzleMySqlConfig,
          ) => {
            return drizzleService.getDrizzle(config);
          },
          // DrizzleMySqlService와 DRIZZLE_MYSQL_CONFIG를 주입받아 DrizzleMySqlService.getDrizzle에서 만들었던 드리즐 연결 객체를 반환한다.
          inject: [DrizzleMySqlService, 'DRIZZLE_MYSQL_CONFIG'],
        },
      ],
      exports: ['DRIZZLE'], // 다른 모듈에서 DrizzleModule을 import하여 'DRIZZLE' provider를 사용할 수 있도록 export한다. DrizzleMySqlService, DRIZZLE_MYSQL_CONFIG는 내부 전용
    };
  }
}
