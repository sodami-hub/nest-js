import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthCheck')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Render('index')
  getHome() {
    return { title: 'home' };
  }
}
