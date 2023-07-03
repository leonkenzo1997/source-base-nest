import { Controller } from '@nestjs/common';
import { RequestFormat } from '../utils/decorator/request.decorator';
import { ResponseSuccessFormat } from '../utils/decorator/response-success.decorator';
import { ResponseFormat } from '../utils/decorator/response.decorator';
import { BaseService } from './base.service';

@RequestFormat()
@ResponseFormat()
@ResponseSuccessFormat()
@Controller()
export class BaseController {
  constructor(private readonly _service: BaseService<any>) {
    // empty
  }
}
