import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { In } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { IResponseErrorSuccess } from '../../utils/interfaces/response.interface';
import { PaginationService } from '../../utils/pagination.service';
import { PasswordService } from '../../utils/password.service';
import { Rule } from '../rules/entities/rule.entity';
import { RulesService } from '../rules/rules.service';
import { MESSAGE_CODE } from './../../messages/message.response';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteMultipleAccountDto } from './dto/delete-multiple-account.dto';
import { UpdateProfileAccountDto } from './dto/update-profile-account.dto';
import { User } from './entities/user.entity';
import { IUser } from './interfaces/user.interface';
import { UsersRepository } from './repositories/users.repository';
import { USER_RELATION, USER_SELECT, UserRole } from './user.const';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
    private paginationService: PaginationService,
    @Inject(forwardRef(() => RulesService))
    private ruleService: RulesService,
  ) {
    super(usersRepository);
  }

  /**
   * This function is create acount super admin
   *
   * @param createSuperAdminDto CreateSuperAdminDto
   * @returns IUser
   */
  async createSuperAdmin(
    createSuperAdminDto: CreateSuperAdminDto,
  ): Promise<IUser> {
    const existedSuperAdmin = await this.findSuperAdminByEmail(
      createSuperAdminDto.email,
    );
    if (existedSuperAdmin) {
      throw new BadRequestException('SUPER_ADMIN_EXISTED');
    }

    createSuperAdminDto.password = await this.passwordService.hashPassword(
      createSuperAdminDto.password,
    );

    const getListUserRule: Rule[] = await this.ruleService.getListRule();
    let newUsersRulesArray: any[] = [];
    await Promise.all(
      getListUserRule.map(async (item: any) => {
        newUsersRulesArray.push({
          rule: {
            id: item.id,
          },
        });
      }),
    );

    const result = await this.usersRepository.create({
      ...createSuperAdminDto,
      role: { id: UserRole.SuperAdmin },
      rules: newUsersRulesArray,
    });

    return result;
  }

  /**
   * This function is find email via role super admin and admin
   *
   * @param email string
   * @returns IUser
   */
  async findSuperAdminAndAdminByEmail(email: string): Promise<IUser> {
    let result = await this.usersRepository.findOne(
      {
        email,
        role: { id: In([UserRole.SuperAdmin, UserRole.Admin]) },
      },
      { role: true, rules: true },
      { rules: { id: true } },
    );
    return result;
  }

  /**
   * This function is find email via role super admin
   *
   * @param email string
   * @returns IUser
   */
  async findSuperAdminByEmail(email: string): Promise<IUser> {
    let result = await this.usersRepository.findOne({
      email,
      role: { id: UserRole.SuperAdmin },
    });
    return result;
  }

  async createAdmin(createAdminDto: CreateSuperAdminDto) {
    const existedAdmin = await this.findAdminByEmail(createAdminDto.email);

    if (existedAdmin) {
      throw new BadRequestException('ADMIN_EXISTED');
    }

    createAdminDto.password = await this.passwordService.hashPassword(
      createAdminDto.password,
    );

    const result = await this.usersRepository.create({
      ...createAdminDto,
      role: { id: UserRole.Admin },
    });

    return result;
  }

  /**
   * This function is find email via role admin
   *
   * @param email string
   * @returns IUser
   */
  async findAdminByEmail(email: string): Promise<IUser> {
    let result = await this.usersRepository.findOne({
      email,
      role: { id: UserRole.Admin },
    });
    return result;
  }

  //create user account
  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const existedUser = await this.findByEmail(createUserDto.email);
    if (existedUser) {
      throw new BadRequestException('ACCOUNT_EXISTED');
    }

    createUserDto.password = await this.passwordService.hashPassword(
      createUserDto.password,
    );

    const result = await this.usersRepository.create({
      ...createUserDto,
      role: { id: UserRole.User },
    });

    return result;
  }

  /**
   * This function is check email exist
   *
   * @param email string
   * @returns boolean
   */
  async checkEmailExist(email: string) {
    const existedEmail = await this.findByEmail(email);
    if (existedEmail) {
      throw new BadRequestException('EMAIL_EXISTED');
    }

    return true;
  }

  /**
   * This function is find email via role users
   *
   * @param email string
   * @returns IUser
   */
  async findUserByEmail(email: string): Promise<IUser> {
    const result = await this.usersRepository.findOne({
      email,
      role: { id: UserRole.User },
    });
    return result;
  }

  /**
   * This function is find email All role
   *
   * @param email string
   * @returns IUser
   */
  async findByEmail(email: string): Promise<IUser> {
    const where = { email };

    let user = await this.usersRepository.findOne(
      where,
      USER_RELATION,
      USER_SELECT,
    );

    if (user) {
      let result = await this.handleDataUser(user);

      return result;
    } else {
      return user;
    }
  }

  /**
   * This function is find id All role
   *
   * @param id number
   * @returns IUser
   */
  async findById(id: number): Promise<IUser> {
    const where = { id };

    let user = await this.usersRepository.findOne(
      where,
      USER_RELATION,
      USER_SELECT,
    );

    if (user) {
      let result = await this.handleDataUser(user);
      return result;
    } else {
      return user;
    }
  }

  /**
   * This function is get detail account by id user
   *
   * @param id number
   * @returns IUser
   */
  // async getDetailUsers({id}:{id: number}): Promise<IUser> {   // declare type object for function
  async getDetailUsers(id: number): Promise<IUser> {
    const where = { id };
    let relations = {
      rules: { rule: true },
      role: true,
    };
    let select = {
      role: { id: true, name: true },
      rules: { rule: { id: true, name: true }, id: true },
    };
    let user = await this.usersRepository.findOne(where, relations, select);

    if (!user) {
      // throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
      throw new HttpException(MESSAGE_CODE.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let result = await this.handleDataUser(user);

    return result;
  }

  /**
   * This function is handle data user by user
   *
   * @param user IUser
   * @returns IUser
   */
  async handleDataUser(user: IUser): Promise<IUser> {
    let userData = user;
    return userData;
  }

  /**
   * This function is update time login access by id user
   *
   * @param id number
   * @param isSaved boolean
   * @returns IUser
   */
  async updateLoginAccessTimeByUserId(
    id: number,
    isSaved: boolean,
  ): Promise<IUser> {
    const result = await this.usersRepository.updateOneAndReturnById(
      id,
      {
        isSaved: isSaved,
        loginAccessTime: new Date(),
      },
      {
        role: true,
        rules: { rule: true },
      },
      { rules: { id: true, rule: { id: true, name: true } } },
    );
    return result;
  }

  /**
   * This function change password by user profile
   *
   * @param id number
   * @param changePasswordDto ChangePasswordDto
   * @returns User | ErrorSuccess
   */
  async changePasswordProfile(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User | IResponseErrorSuccess> {
    //Find User
    let userData: any = await this.findById(id);

    if (!userData) {
      throw new HttpException('ACCOUNT_NOT_REGISTERED', HttpStatus.NOT_FOUND);
    }

    let confirmPassword = changePasswordDto.confirmPassword;
    let newPassword = changePasswordDto.newPassword;
    let oldPassword = changePasswordDto.oldPassword;

    if (oldPassword) {
      //Compare old password
      const checkOldPassword = this.passwordService.comparePassword(
        oldPassword,
        userData.password,
      );

      // check password
      if (!checkOldPassword) {
        throw new HttpException('WRONG_OLD_PASSWORD', HttpStatus.BAD_REQUEST);
      }

      // check old and new password
      if (oldPassword === newPassword) {
        throw new HttpException(
          'NEW_AND_OLD_PASSWORD_MATCH',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // check confirm and new password
    if (confirmPassword !== newPassword) {
      throw new HttpException(
        'NEW_AND_CONFIRM_PASSWORD_NOT_MATCH',
        HttpStatus.BAD_REQUEST,
      );
    }

    // hash new password
    let changePassword = await this.passwordService.hashPassword(newPassword);

    let relations = { rules: { rule: true }, role: true };
    let select = {
      role: { id: true, name: true },
      rules: { rule: { id: true, name: true }, id: true },
    };

    let data = {
      password: changePassword,
    };

    // update new password
    let result = await this.usersRepository.updateOneAndReturnById(
      id,
      data,
      relations,
      select,
    );

    return result;
  }

  /**
   * This function update profile account
   *
   * @param id number
   * @param updateProfileAccountDto UpdateProfileAccountDto
   * @returns IUser
   */
  async updateProfileAccount(
    id: number,
    updateProfileAccountDto: UpdateProfileAccountDto,
  ): Promise<IUser> {
    const result = await this.usersRepository.updateOneAndReturnById(id, {
      ...updateProfileAccountDto,
    });
    return result;
  }

  /**
   * This function is delete account by id user
   *
   * @param id number
   */
  async deleteAccount(id: number): Promise<void> {
    let user: IUser = await this.findById(id);

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // soft delete of user and delete for children table (rules, building, sessions)
    await this.usersRepository.softRemove(id, {
      rules: true,
      sessions: true,
    });
  }

  /**
   * This function is delete multiple account
   *
   * @param deleteMultipleAccountDto DeleteMultipleAccountDto
   */
  async deleteMultipleAccount(
    deleteMultipleAccountDto: DeleteMultipleAccountDto,
  ): Promise<void> {
    await Promise.all(
      deleteMultipleAccountDto.usersArray.map(async (user: any) => {
        let id = user?.id;
        let userData: IUser = await this.findById(id);

        await this.deleteAccount(id);
      }),
    );
  }

  /**
   * This function is recover account
   *
   * @param id number
   */
  async recoverAccount(id: number): Promise<void> {
    let relations = { usersBuildings: true, rules: true };

    let user: IUser = await this.findById(id);

    if (user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    // await this.usersRepository.recover(id, relations);
    let where = { id: id };
    await this.usersRepository.restore(where);
  }
}
