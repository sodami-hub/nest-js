import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'node:path';
import * as nunjucks from 'nunjucks';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // 스웨거

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ⚠️ DTO의 검사를 위한 ValidationPipe를 전역으로 등록한다. (main.ts에서 설정)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // DTO 에서 @Transform() 데코레이터를 사용하기 위한 설정
    }),
  );

  // 템플릿 엔진 설정 : main.ts에 뷰 엔진과 정적 파일 경로를 설정한다.
  const viewsPath = join(__dirname, '..', 'views');

  nunjucks.configure(viewsPath, {
    watch: true,
    express: app.getHttpAdapter().getInstance(),
  });
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('html');

  // 정적 파일 경로 설정 - nunjucks에서 사용하는 스크립트의 css, js, img 파일을 제공하기 위해 public 폴더를 정적 파일 경로로 설정한다.
  // 즉 <link rel="stylesheet" href="/css/style.css" /> 과 같은 요청은 localhost:3000/css/style.css 로 요청이 들어오고 서버는 public/css/style.css 파일을 찾아서 제공한다.
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AI Agent API')
    .setDescription('AI Agent API 문서')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT ?? 3000}`,
    );
  });
}

void bootstrap();
