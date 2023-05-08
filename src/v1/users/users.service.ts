import { In, Like } from 'typeorm';
import { ErrorSuccess } from '../../interfaces/error-succes.interface';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { CreateUserDto } from './dto/create-user.dto';

import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { PasswordService } from '../../utils/password.service';
import { IJwt } from '../authentication/interfaces/jwt.interface';
import { BuildingsService } from '../buildings/buildings.service';
import { FloorsService } from '../floors/floors.service';
import { Rule } from '../rules/entities/rule.entity';
import { RulesService } from '../rules/rules.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { DeleteMultipleAccountDto } from './dto/delete-multiple-account.dto';
import { GetListUserByBuildingIdDto } from './dto/get-list-user-by-buidling.dto';
import { UpdateProfileAccountDto } from './dto/update-profile-account.dto';
import { User } from './entities/user.entity';
import { IUser } from './interfaces/user.interface';
import { UsersRepository } from './repositories/users.repository';
import { UserRole, USER_RELATION, USER_SELECT } from './user.const';

@Injectable()
export class UsersService extends BaseService<User, UsersRepository> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
    private ruleService: RulesService,
    @Inject(forwardRef(() => FloorsService))
    private floorsService: FloorsService,
    @Inject(forwardRef(() => BuildingsService))
    private buildingService: BuildingsService,
    private paginationService: PaginationService,
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

  // async createAdmin(createAdminDto: CreateUserDto) {
  //   const existedAdmin = await this.findAdminByEmail(createAdminDto.email);

  //   if (existedAdmin) {
  //     throw new BadRequestException('ADMIN_EXISTED');
  //   }

  //   createAdminDto.password = await this.passwordService.hashPassword(
  //     createAdminDto.password,
  //   );

  //   const result = await this.usersRepository.create({
  //     ...createAdminDto,
  //     role: { id: UserRole.Admin },
  //   });

  //   return result;
  // }

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

  // create user account
  // async createUser(createUserDto: CreateUserDto): Promise<IUser> {
  //   const existedUser = await this.findByEmail(createUserDto.email);
  //   if (existedUser) {
  //     throw new BadRequestException('ACCOUNT_EXISTED');
  //   }

  //   createUserDto.password = await this.passwordService.hashPassword(
  //     createUserDto.password,
  //   );

  //   const result = await this.usersRepository.create({
  //     ...createUserDto,
  //     role: { id: UserRole.User },
  //   });

  //   return result;
  // }

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
   * This function is create account
   * @param createUserDto
   * @returns
   */
  async createAccount(createUserDto: CreateUserDto): Promise<IUser> {
    const existedUser = await this.findByEmail(createUserDto.email);
    if (existedUser) {
      throw new BadRequestException('ACCOUNT_EXISTED');
    }

    // check phone number
    let checkPhoneNumber = await this.usersRepository.findOne({
      phoneNumber: createUserDto.phoneNumber,
    });

    if (checkPhoneNumber) {
      throw new HttpException('PHONE_NUMBER_EXIST', HttpStatus.BAD_REQUEST);
    }

    //check role super admin
    const roleId = createUserDto.roleId;

    createUserDto['role'] = {
      id: roleId,
    };
    delete createUserDto.roleId;

    // check building
    let checkBuilding: boolean = await this.buildingService.checkListBuilding(
      createUserDto.usersBuildings,
    );

    if (!checkBuilding) {
      throw new HttpException('INVALID_USER_BUILDING', HttpStatus.BAD_REQUEST);
    }

    let usersBuildings = createUserDto.usersBuildings;
    // format data to create data in children table users-buildings
    let newUsersBuildings: any[] = [];
    await Promise.all(
      usersBuildings.map(async (item: any) => {
        newUsersBuildings.push({
          building: {
            id: item.id,
          },
        });
      }),
    );

    createUserDto.usersBuildings = newUsersBuildings;

    // check role
    switch (roleId) {
      case UserRole.SuperAdmin:
        throw new HttpException('NOT_CREATE_SUPER_ADMIN', HttpStatus.FORBIDDEN);
      case UserRole.User:
        // check floor
        let checkFloor: boolean = await this.floorsService.checkListFloors(
          createUserDto.floors,
        );

        if (!checkFloor) {
          throw new HttpException('INVALID_FLOORS', HttpStatus.BAD_REQUEST);
        }
        let floorArray: any[] = createUserDto?.floors;
        // format data to create data in children table users-buildings-floors
        let usersBuildingsFloorsArrays: any[] = [];
        await Promise.all(
          // handle floors array
          floorArray.map(async (floor: any) => {
            let usersBuildingsFloors = {
              // get first element of buildings array
              building: { id: newUsersBuildings[0].building.id },
              floor: { id: floor.id },
            };
            usersBuildingsFloorsArrays.push(usersBuildingsFloors);
          }),
        );
        createUserDto['usersBuildingsFloors'] = usersBuildingsFloorsArrays;
        delete createUserDto.floors;
        delete createUserDto.rules;
        break;
      case UserRole.Admin:
        let arrayRule = createUserDto?.rules;

        if (!arrayRule) {
          throw new HttpException(
            'USER_ACCOUNT_NOT_RULE',
            HttpStatus.BAD_REQUEST,
          );
        }
        // check rule
        let checkRule: boolean = await this.ruleService.checkRule(arrayRule);
        if (!checkRule) {
          throw new HttpException('INVALID_RULES', HttpStatus.BAD_REQUEST);
        }

        // handle data to create rules
        let rules = createUserDto.rules;
        let newUsersRules: any[] = [];
        await Promise.all(
          rules.map(async (item: any) => {
            newUsersRules.push({
              rule: {
                id: item.id,
              },
            });
          }),
        );

        createUserDto.rules = newUsersRules;

        // incase: create more account admin for building
        // so we need assign all floor of building for admin account
        let arrayFloors: any[] = [];

        await Promise.all(
          createUserDto.usersBuildings.map(async (building: any) => {
            // find data building
            let dataBuilding = await this.buildingService.detailBuilding(
              building.building.id,
            );

            // check floor of building
            if (dataBuilding?.floors.length > 0) {
              dataBuilding.floors.map((floor: any) => {
                arrayFloors.push({
                  building: {
                    id: dataBuilding.id,
                  },
                  floor: {
                    id: floor.id,
                  },
                });
              });
            }
          }),
        );

        if (arrayFloors.length > 0) {
          createUserDto['usersBuildingsFloors'] = arrayFloors;
        }
        break;
    }

    // hash password
    createUserDto.password = await this.passwordService.hashPassword(
      createUserDto.password,
    );

    const result = await this.usersRepository.create({
      ...createUserDto,
    });

    return result;
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

    let relations = {
      rules: { rule: true },
      role: true,
      usersBuildings: { building: true },
      usersBuildingsFloors: { building: true, floor: true },
    };
    let select = {
      role: { id: true, name: true },
      rules: { rule: { id: true, name: true }, id: true },
      usersBuildings: {
        building: { id: true, address: true, name: true, status: true },
        id: true,
      },
      usersBuildingsFloors: {
        building: { id: true, address: true, name: true, status: true },
        id: true,
        floor: { id: true, name: true },
      },
    };

    let user = await this.usersRepository.findOne(where, relations, select);

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
   * This function is using to get list user account by building
   *
   * @param getListUserByBuildingIdDto getListUserByBuildingIdDto
   * @returns IPagination
   */
  async getListUsersByBuildingId(
    getListUserByBuildingIdDto: GetListUserByBuildingIdDto,
  ): Promise<IPagination> {
    const page = getListUserByBuildingIdDto.page
      ? getListUserByBuildingIdDto.page
      : 1;

    const limit = getListUserByBuildingIdDto.limit
      ? getListUserByBuildingIdDto.limit
      : 10;

    const sortType = getListUserByBuildingIdDto.sortType;

    const sortBy = getListUserByBuildingIdDto.sortBy
      ? getListUserByBuildingIdDto.sortBy
      : '';

    const keyword = getListUserByBuildingIdDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    where['role'] = { id: UserRole.User };

    let relations = {
      role: true,
      usersBuildingsFloors: { building: true, floor: true },
      usersBuildings: { building: true },
    };
    let selects = {
      role: { id: true, name: true },
      usersBuildingsFloors: {
        id: true,
        building: { id: true, name: true },
        floor: { id: true, name: true },
      },
      usersBuildings: {
        id: true,
        building: { id: true, name: true },
      },
    };

    if (getListUserByBuildingIdDto.buildingId) {
      where = {
        ...where,
        usersBuildings: {
          building: { id: getListUserByBuildingIdDto.buildingId },
        },
      };
    }

    if (getListUserByBuildingIdDto.keyword) {
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

    const [users, total] = await this.usersRepository.findAndCount(
      where,
      relations,
      selects,
      limit,
      skip,
      order,
    );

    users.map(async (item: any) => {
      item = await this.handleDataUser(item);
      return item;
    });

    const result = this.paginationService.pagination(users, total, page, limit);
    return result;
  }

  /**
   * This function is using to get list admin account by building
   *
   * @param user IJwt
   * @param getListAdminsByBuildingIdDto getListUserByBuildingIdDto
   * @returns IPagination
   */
  async getListAdminsByBuildingId(
    user: IJwt,
    getListAdminsByBuildingIdDto: GetListUserByBuildingIdDto,
  ): Promise<IPagination> {
    const page = getListAdminsByBuildingIdDto.page
      ? getListAdminsByBuildingIdDto.page
      : 1;

    const limit = getListAdminsByBuildingIdDto.limit
      ? getListAdminsByBuildingIdDto.limit
      : 10;

    const sortType = getListAdminsByBuildingIdDto.sortType;

    const sortBy = getListAdminsByBuildingIdDto.sortBy
      ? getListAdminsByBuildingIdDto.sortBy
      : '';

    const keyword = getListAdminsByBuildingIdDto.keyword;

    const skip = (page - 1) * limit;
    let order = {};
    let where = {};
    where['role'] = { id: UserRole.Admin };

    if (user.roleId === UserRole.Admin) {
      where = { ...where, id: user.userId };
    }

    let relations = {
      role: true,
      usersBuildingsFloors: { building: true, floor: true },
      usersBuildings: { building: true },
    };
    let selects = {
      role: { id: true, name: true },
      usersBuildingsFloors: {
        id: true,
        building: { id: true, name: true },
        floor: { id: true, name: true },
      },
      usersBuildings: {
        id: true,
        building: { id: true, name: true },
      },
    };

    if (getListAdminsByBuildingIdDto.buildingId) {
      where = {
        ...where,
        usersBuildings: {
          building: { id: getListAdminsByBuildingIdDto.buildingId },
        },
      };
    }

    if (getListAdminsByBuildingIdDto.keyword) {
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

    const [users, total] = await this.usersRepository.findAndCount(
      where,
      relations,
      selects,
      limit,
      skip,
      order,
    );

    users.map(async (item: any) => {
      item = await this.handleDataUser(item);
      return item;
    });

    const result = this.paginationService.pagination(users, total, page, limit);
    return result;
  }

  /**
   * This function is get detail account by id user
   *
   * @param id number
   * @returns IUser
   */
  async getDetailUsers(id: number): Promise<IUser> {
    const where = { id };
    let relations = {
      rules: { rule: true },
      role: true,
      usersBuildingsFloors: { building: true, floor: true },
      usersBuildings: { building: true },
    };
    let select = {
      role: { id: true, name: true },
      rules: { rule: { id: true, name: true }, id: true },
      usersBuildingsFloors: {
        building: { id: true, address: true, name: true, status: true },
        id: true,
        floor: { id: true, name: true },
      },
      usersBuildings: {
        building: { id: true, address: true, name: true, status: true },
        id: true,
      },
    };
    let user = await this.usersRepository.findOne(where, relations, select);
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
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
    let floorsArray: any = [];
    let building = {};

    user.usersBuildings.map((item: any) => {
      building = item.building;
      return item;
    });

    if (user.usersBuildingsFloors) {
      user.usersBuildingsFloors.map((item: any) => {
        floorsArray.push(item.floor);
        return item;
      });
    }

    user['building'] = building;
    user['floors'] = floorsArray;
    delete user.usersBuildingsFloors;
    delete user.usersBuildings;
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
  ): Promise<User | ErrorSuccess> {
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

  // async updateAccount(
  //   id: number,
  //   updateProfileAccountDto: UpdateProfileAccountDto,
  // ): Promise<IUser> {
  //   const result = await this.usersRepository.updateOneAndReturnById(id, {
  //     ...updateProfileAccountDto,
  //   });
  //   return result;
  // }

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
      usersBuildings: true,
      usersBuildingsFloors: true,
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
