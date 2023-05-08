import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { ErrorLogService } from './error-log.service';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { UserRole } from '../users/user.const';
import { AuthRules } from '../rules/decorator/rules.decorator';
import { UserRule } from '../rules/rule.const';
import { GetErrorLogDto } from './dto/get-error-log.dto';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { IRequest } from 'src/interfaces/request.interface';

@Controller()
export class ErrorLogController {
  constructor(
    private readonly errorLogService: ErrorLogService,
    private res: ResponseService,
  ) {}

  /**
   * This API get list error logs
   *
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.ErrorLogInquiry)
  @Get('')
  public async listAll(
    @Query() getErrorLogDto: GetErrorLogDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.errorLogService.findAllErrorLog(getErrorLogDto);

    return this.res.success(results);
  }

  /**
   * This API create new device type
   *
   * @body createErrorLogDto CreateErrorLogDto
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Post('')
  public async createErrorLog(
    @Body() createErrorLogDto: CreateErrorLogDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const results = await this.errorLogService.createErrorLog(
      createErrorLogDto,
      user.userId,
    );

    return this.res.success(results);
  }
}
