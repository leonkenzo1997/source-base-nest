import { Controller } from '@nestjs/common';
import { ResponseService } from '../../utils/response.service';
import { UsersRulesService } from './users-rules.service';
import { BaseController } from '../../base/base-controller';

@Controller()
export class UsersRulesController extends BaseController {
  constructor(
    private readonly _usersRulesService: UsersRulesService,
    private _res: ResponseService,
  ) {
    super(_usersRulesService)
  }
}
