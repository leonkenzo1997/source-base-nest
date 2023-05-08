import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common';
import { Like } from 'typeorm';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { RoleName } from '../roles/roles.const';
import { UpdateUsersRulesDto } from '../users-rules/dto/update-users-rules.dto';
import { UsersRulesService } from '../users-rules/users-rules.service';
import { IUser } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { GetRuleDto } from './dto/get-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Rule } from './entities/rule.entity';
import { RuleRepository } from './repositories/rule.repository';
import { UserRule } from './rule.const';

@Injectable()
export class RulesService {
  constructor(
    private readonly ruleRepository: RuleRepository,
    private paginationService: PaginationService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly usersRulesService: UsersRulesService,
  ) {}

  /**
   * This function is create new rule
   *
   * @param createRuleDto CreateRuleDto
   * @returns Rule
   */
  async create(createRuleDto: CreateRuleDto): Promise<Rule> {
    const result = await this.ruleRepository.create(createRuleDto);

    const userSuperAdmin = await this.usersService.find({
      role: { name: RoleName.SUPERADMIN },
    });

    if (userSuperAdmin.length > 0) {
      for (let user of userSuperAdmin) {
        // create new rules for account super admin
        await this.usersRulesService.create({
          rule: { id: result.id },
          user: { id: user.id },
        });
      }
    }

    return result;
  }

  /**
   * This function is get detail rule
   *
   * @param id number
   * @returns Rule
   */
  async getDetail(id: number): Promise<Rule> {
    const where = { id };
    return await this.ruleRepository.findOne(where);
  }

  /**
   * This function is update rule
   *
   * @param id number
   * @param updateRuleDto UpdateRuleDto
   * @returns Rule
   */
  async updateRule(id: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const data = { name: updateRuleDto.name };
    return await this.ruleRepository.updateOneAndReturnById(id, data);
  }

  /**
   * This function get list of rules
   *
   * @param getRuleDto GetRuleDto
   * @returns IPagination
   */
  async getList(getRuleDto: GetRuleDto): Promise<IPagination> {
    const page = getRuleDto.page ? getRuleDto.page : 1;
    const limit = getRuleDto.limit ? getRuleDto.limit : 10;
    const sortType = getRuleDto.sortType;
    const sortBy = getRuleDto.sortBy ? getRuleDto.sortBy : '';
    const keyword = getRuleDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getRuleDto.keyword) {
      where['name'] = Like(`%${keyword}%`);
    }

    if (sortBy) {
      order = {
        [sortBy]: sortType,
      };
    } else {
      order = {
        id: sortType,
      };
    }

    // get data and total data
    const [rules, total] = await this.ruleRepository.findAndCount(
      where,
      null,
      null,
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(rules, total, page, limit);
    return result;
  }

  /**
   * this method is get list rule from admin account by id user
   *
   * @param userId number
   * @returns {}
   */
  public async getListRuleByUserAccount(userId: number): Promise<{}> {
    const user = await this.usersService.findById(userId);

    // check found user account
    if (!user || user === null) {
      throw new HttpException('ACCOUNT_NOT_REGISTERED', HttpStatus.BAD_REQUEST);
    }

    const arrayRules = await this.ruleRepository.find({}, null, ['id', 'name']);

    // list rules and status rule asssign user
    let rulesUser: any[] = [];
    for (let rule of user.rules) {
      rulesUser.push({ name: rule.rule.name });
    }

    return { rulesUser, arrayRules };
  }

  /**
   * this function is get all list rule
   *
   * @param
   * @returns Rule[]
   */
  async getListRule(): Promise<Rule[]> {
    return await this.ruleRepository.find({}, null, {});
  }

  /**
   * This function is check rule
   *
   * @param ruleArray any[]
   * @returns boolean
   */
  async checkRule(ruleArray: any[]): Promise<boolean> {
    let result = await ruleArray.some((rule: any) =>
      Object.values(UserRule).includes(rule.id),
    );
    return result;
  }

  /**
   * This function change user assign rule
   *
   * @param userId number
   * @param updateUsersRulesDto UpdateUsersRulesDto
   * @returns IUser
   */
  public async changeRulesOfUser(
    userId: number,
    updateUsersRulesDto: UpdateUsersRulesDto,
  ): Promise<IUser> {
    // change rule of user
    let results = await this.usersRulesService.changeRulesOfUser(
      userId,
      updateUsersRulesDto,
    );
    return results;
  }
}
