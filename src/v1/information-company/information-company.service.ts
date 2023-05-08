import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { CreateInformationCompanyDto } from './dto/create-information-company.dto';
import { GetListInformationCompanyDto } from './dto/get-list-information-company.dto';
import { IInformationCompany } from './interfaces/information-company.interface';
import { InformationCompanyRepository } from './repositories/information-company.repository';

@Injectable()
export class InformationCompanyService {
  constructor(
    private readonly informationCompanyRepository: InformationCompanyRepository,
    private paginationService: PaginationService,
  ) {}

  /**
   * This function get list all information company
   *
   * @param getListInformationCompanyDto GetListInformationCompanyDto
   * @returns IPagination
   */
  public async getList(
    getListInformationCompanyDto: GetListInformationCompanyDto,
  ): Promise<IPagination> {
    const page = getListInformationCompanyDto.page
      ? getListInformationCompanyDto.page
      : 1;
    const limit = getListInformationCompanyDto.limit
      ? getListInformationCompanyDto.limit
      : 10;
    const sortType = getListInformationCompanyDto.sortType;
    const sortBy = getListInformationCompanyDto.sortBy
      ? getListInformationCompanyDto.sortBy
      : '';
    const keyword = getListInformationCompanyDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getListInformationCompanyDto.keyword) {
      where['address'] = Like(`%${keyword}%`);
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

    const [informationCompany, total] =
      await this.informationCompanyRepository.findAndCount(
        where,
        null,
        null,
        limit,
        skip,
        order,
      );

    const result = this.paginationService.pagination(
      informationCompany,
      total,
      page,
      limit,
    );

    return result;
  }

  /**
   * This function create new information company
   *
   * @param createInformationCompanyDto CreateInformationCompanyDto
   * @returns IInformationCompany
   */
  public async create(
    createInformationCompanyDto: CreateInformationCompanyDto,
  ): Promise<IInformationCompany> {
    const dataCreate = await this.informationCompanyRepository.create(
      createInformationCompanyDto,
    );

    return dataCreate;
  }
}
