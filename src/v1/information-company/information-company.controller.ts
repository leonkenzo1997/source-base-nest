import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { UserRole } from '../users/user.const';
import { GetListInformationCompanyDto } from './dto/get-list-information-company.dto';
import { InformationCompanyService } from './information-company.service';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { CreateInformationCompanyDto } from './dto/create-information-company.dto';

@Controller()
export class InformationCompanyController {
  constructor(
    private readonly informationCompanyService: InformationCompanyService,
    private res: ResponseService,
  ) {}

  /**
   * This API list all information company
   *
   * @query getListInformationCompanyDto GetListInformationCompanyDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User, UserRole.SuperAdmin)
  @Get('')
  public async listAll(
    @Query() getListInformationCompanyDto: GetListInformationCompanyDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const result = await this.informationCompanyService.getList(
      getListInformationCompanyDto,
    );
    return this.res.success(result);
  }

  /**
   * This API create new information company
   *
   * @body createInformationCompanyDto CreateInformationCompanyDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Post('')
  public async create(
    @Body() createInformationCompanyDto: CreateInformationCompanyDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const result = await this.informationCompanyService.create(
      createInformationCompanyDto,
    );

    return this.res.success(result);
  }
}
