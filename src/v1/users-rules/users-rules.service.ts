import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { IUser } from '../users/interfaces/user.interface';
import { UserRole } from '../users/user.const';
import { UsersService } from '../users/users.service';
import { UpdateUsersRulesDto } from './dto/update-users-rules.dto';
import { UserRule } from './entities/user-rule.entity';
import { UsersRulesRepository } from './repositories/rule.repository';

@Injectable()
export class UsersRulesService extends BaseService<UserRule> {
  constructor(
    private readonly _usersRulesRepository: UsersRulesRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    super(_usersRulesRepository);
  }

  /**
   * method update rule admin acount by data update
   *
   * @param updateUsersRulesDto UpdateUsersRulesDto
   * @returns {}
   */
  public async changeRulesOfUser(
    userId: number,
    updateUsersRulesDto: UpdateUsersRulesDto,
  ): Promise<IUser> {
    const user = await this.usersService.findOne(
      { id: userId },
      { rules: { rule: true }, role: true },
    );

    // check user
    if (user.role.id === UserRole.SuperAdmin) {
      throw new HttpException('USER_NOT_UPDATE_RULE', HttpStatus.FORBIDDEN);
    }

    // check account update
    if (!user || user === null) {
      throw new HttpException('ACCOUNT_NOT_REGISTERED', HttpStatus.NOT_FOUND);
    }

    // delete ole rule admin acount
    await this._usersRulesRepository.softDelete({ user: { id: userId } });

    // create new rules admin account
    const rules: any[] = updateUsersRulesDto.rulesIds.map((ruleId) => ({
      rule: { id: ruleId.id },
    }));

    user.rules = rules;

    await user.save();
    let results = await this.usersService.findById(userId);
    return results;
  }
}
