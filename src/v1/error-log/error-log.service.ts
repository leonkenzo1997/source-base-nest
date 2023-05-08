import { BadRequestException, Injectable } from '@nestjs/common';
import { IPagination } from '../../interfaces/pagination.interface';
import { ErrorLogRepository } from './repostiories/error-log.repository';
import { GetErrorLogDto } from './dto/get-error-log.dto';
import { PaginationService } from '../../utils/pagination.service';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { UsersService } from '../users/users.service';
import { BuildingsService } from '../buildings/buildings.service';
import { ErrorLog } from './entities/error-log.entity';

@Injectable()
export class ErrorLogService {
  constructor(
    private readonly errorLogRepository: ErrorLogRepository,
    private paginationService: PaginationService,
    private usersService: UsersService,
    private buildingsService: BuildingsService,
  ) {}

  /**
   * This function is list all error logs
   *
   * @param getErrorLogDto GetErrorLogDto
   * @returns IPagination
   */
  public async findAllErrorLog(
    getErrorLogDto: GetErrorLogDto,
  ): Promise<IPagination> {
    const page = getErrorLogDto.page ? getErrorLogDto.page : 1;
    const limit = getErrorLogDto.limit ? getErrorLogDto.limit : 10;
    const sortType = getErrorLogDto.sortType;
    const sortBy = getErrorLogDto.sortBy ? getErrorLogDto.sortBy : '';
    //const keyword = getErrorLogDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    const where = {};
    if (sortBy) {
      order = {
        [sortBy]: sortType,
      };
    } else {
      order = {
        id: sortType,
      };
    }

    const [groups, total] = await this.errorLogRepository.findAndCount(
      where,
      null,
      null,
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(
      groups,
      total,
      page,
      limit,
    );
    return result;
  }

  /**
   * This function is create new error log
   *
   * @param createErrorLogDto CreateErrorLogDto
   * @param userId number
   * @returns ErrorLog
   */
  public async createErrorLog(
    createErrorLogDto: CreateErrorLogDto,
    userId: number,
  ): Promise<ErrorLog> {
    const user = await this.usersService.findOne(
      { id: userId },
      { buildings: true },
    );

    const building = await this.buildingsService.findOne({
      id: createErrorLogDto.building,
    });

    if (user.buildings[0].id != building.id) {
      throw new BadRequestException('USER_NOT_BUILDING');
    }

    const dataCreate = {
      ...createErrorLogDto,
      building: building,
      user: user,
      reporter: user.userName,
      buildingName: building.name,
      userRole: user.role.name,
    };

    return await this.errorLogRepository.create(dataCreate);
  }
}
