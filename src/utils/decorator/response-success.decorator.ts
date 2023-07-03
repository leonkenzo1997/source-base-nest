import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ResponseSuccessDto } from '../dto/response.dto';

export function ResponseSuccessFormat() {
  return applyDecorators(
    // ApiOkResponse({
    //   description: 'Success Format 200',
    //   type: ResponseSuccessDto,
    // }),
    ApiResponse({
      status: 201,
      description: 'Success Format',
      type: ResponseSuccessDto,
    }),
    // ApiCreatedResponse({
    //   // status: 201,
    //   description: 'Success Format 201',
    //   type: ResponseSuccessDto,
    // }),
  );
}
