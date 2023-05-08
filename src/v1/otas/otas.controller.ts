import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { GetBuildingDto } from '../buildings/dto/get-buildings.dto';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { AuthRules } from '../rules/decorator/rules.decorator';
import { UserRule } from '../rules/rule.const';
import { UserRole } from '../users/user.const';
import { CreateOtaDto } from './dto/create-otas.dto';
import { DeleteOtaDto } from './dto/delete-otas.dto';
import {
  DetailOtaDto,
  ListOtaDto,
  NewOtaDeviceTypeDto,
} from './dto/param-ota.dto';
import { OtasService } from './otas.service';

@Controller()
export class OtasController {
  constructor(
    private readonly otasService: OtasService,
    private res: ResponseService,
  ) {}

  /**
   * This API upload file ota to Azure
   *
   * @uploadFile file UploadedFileMetadata
   * @body createOtaDto CreateOtaDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.OTAManagement)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createOtaDto: CreateOtaDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const response = await this.otasService.uploadFile(file, createOtaDto);
    return this.res.success(response);
  }

  /**
   * This API list ota
   *
   * @param param ListOtaDto
   * @query getBuildingDto GetBuildingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.OTAManagement)
  @Get(':deviceType')
  public async listOtaDeviceType(
    @Param() param: ListOtaDto,
    @Query() getBuildingDto: GetBuildingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const id = param.deviceType;
    const response = await this.otasService.listOtaFromDeviceType(
      id,
      getBuildingDto,
    );

    return this.res.success(response);
  }

  /**
   * This API list ota
   *
   * @query getBuildingDto GetBuildingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.OTAManagement)
  @Get('')
  public async listOta(
    @Query() getBuildingDto: GetBuildingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const response = await this.otasService.listOtaFromDeviceType(
      null,
      getBuildingDto,
    );

    return this.res.success(response);
  }

  /**
   * This API get new version
   *
   * @param param NewOtaDeviceType
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get('/newVersion/:deviceType')
  public async getNewVersion(
    @Param() param: NewOtaDeviceTypeDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const deviceType = param.deviceType;
    const response = await this.otasService.newVersion(deviceType);

    return this.res.success(response);
  }

  /**
   * This API delete ota
   *
   * @body otaIds DeleteOtaDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Put('')
  public async deleteOta(
    @Body() otaIds: DeleteOtaDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const response = await this.otasService.deleteOtas(otaIds);
    return this.res.success(response);
  }

  /**
   * This API create ota in database
   *
   * @body createOtaDto CreateOtaDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Post('')
  public async createOtas(
    @Body() createOtaDto: CreateOtaDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const response = await this.otasService.createOtas(createOtaDto);
    return this.res.success(response);
  }

  /**
   * This API generate sas token download ota
   *
   * @param param DetailOtaDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin, UserRole.User)
  @Get('/download/:id')
  public async downloadOtas(
    @Param() param: DetailOtaDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const id = param.id;
    const response = await this.otasService.downloadOtas(id);

    return this.res.success(response);
  }

  /**
   * This API upload file ota to Azure
   *
   * @uploadFile file UploadedFileMetadata
   * @param createOtaDto CreateOtaDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.OTAManagement)
  @Post('/upload/directly')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFileDirectly(
    @UploadedFile() file: Express.Multer.File,
    @Body() createOtaDto: CreateOtaDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const response = await this.otasService.uploadFileDirectly(
      file,
      createOtaDto,
    );
    return this.res.success(response);
  }

  /**
   * This API get list ota new version
   *
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get('list/newVersion')
  public async getListNewVersion(): Promise<ISuccessResponse | IErrorResponse> {
    const response = await this.otasService.getListNewVersion();
    return this.res.success(response);
  }
}
