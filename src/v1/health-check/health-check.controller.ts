import { Controller, Get } from '@nestjs/common';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { HealthCheckService } from './health-check.service';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private res: ResponseService,
  ) {}

  /**
   * This API health check code
   * @returns ISuccessResponse | IErrorResponse
   */
  @Get()
  public async select(): Promise<ISuccessResponse | IErrorResponse> {
    return this.res.success(await this.healthCheckService.select());
  }
}
