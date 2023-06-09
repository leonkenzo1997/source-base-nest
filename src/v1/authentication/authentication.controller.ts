import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IRequest } from '../../interfaces/request.interface';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh.guard';

@ApiTags('Authentication')
@Controller()
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private res: ResponseService,
  ) {}

  /**
   * This API generate new access token by account admin
   *
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @UseGuards(JwtRefreshTokenGuard)
  @Get('admin/access-token')
  @ApiOperation({ description: 'This API generate new access token by account admin' })
  async accessTokenAdmin(
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.authService.accessToken(req.user);
    return this.res.success(data);
  }

  /**
   *  This API generate new access token by account user
   *
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @UseGuards(JwtRefreshTokenGuard)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ description: 'This API generate new access token by account user' })
  @Get('user/access-token')
  async accessTokenUser(
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.authService.accessToken(req.user);
    return this.res.success(data);
  }

  /**
   * This API account user login
   *
   * @body loginDto LoginDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @Post('user-login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({ description: 'This API account user login' })
  async userLogin(
    @Body() loginDto: LoginDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.authService.userLogin(loginDto);
    return this.res.success(data, 'LOGIN_SUCCESS');
  }

  /**
   * This API account admin login
   *
   * @body loginDto LoginDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @Post('admin-login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({ description: 'This API account admin login' })
  async adminLogin(
    @Body() loginDto: LoginDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data: any = await this.authService.adminLogin(loginDto);
    return this.res.success(data, 'LOGIN_SUCCESS');
  }

  /**
   * This API logout
   *
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @Post('logout')
  @ApiOperation({ description: 'This API logout' })
  async logout(
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let user = req.user;
    const data: any = await this.authService.logout(user);
    return this.res.success(data);
  }
}
