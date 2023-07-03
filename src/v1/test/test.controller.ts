import { ResponseService } from 'src/utils/response.service';
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guard/jwt-authentication.guard';
// import { UsersService } from '../users/users.service';
import { TestService } from './test.service';
import { IRequest } from '../../utils/interfaces/request.interface';


@Controller()
export class TestController {
  constructor(
    // private readonly usersService: UsersService,
    private readonly testService: TestService,
    private res: ResponseService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async test(@Request() req: IRequest) {
    let user = req.user;
    const data = await this.testService.test(user?.sessionId);
    return this.res.success(data);
  }
}
