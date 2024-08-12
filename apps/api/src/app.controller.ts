import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/ping')
  pingPong(): string {
    return 'pong';
  }
}
