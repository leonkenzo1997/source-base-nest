import { Controller } from '@nestjs/common';
import { ResponseService } from '../../utils/response.service';
import { UsersRulesService } from './users-rules.service';

@Controller()
export class UsersRulesController {
  constructor(
    private readonly usersRulesService: UsersRulesService,
    private res: ResponseService,
  ) {}
}
