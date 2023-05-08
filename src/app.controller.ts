import {
    Controller, Get
} from '@nestjs/common';
@Controller()
export class AppController {
  @Get('')
  public async hello() {
    return 'Hello World!';
  }
}
