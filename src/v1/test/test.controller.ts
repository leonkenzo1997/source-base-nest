import { ResponseService } from '../../utils/response.service';
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { IRequest } from '../../interfaces/request.interface';
import { JwtAuthGuard } from '../authentication/guard/jwt-authentication.guard';
// import { UsersService } from '../users/users.service';
import { TestService } from './test.service';
import { RulesService } from '../rules/rules.service';


@Controller()
export class TestController {
  constructor(
    // private readonly usersService: UsersService,
    private readonly testService: TestService,
    private readonly rulesService: RulesService,
    private res: ResponseService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async test(@Request() req: IRequest) {
    let user = req.user;
    const data = await this.testService.testSchedule();
    return this.res.success(data);
  }
}
