import { applyDecorators } from '@nestjs/common';
import {
    ApiDefaultResponse,
    ApiResponse
} from '@nestjs/swagger';
import { ResponseDto, ResponseSuccessDto } from '../dto/response.dto';

export function ResponseFormat() {
  return applyDecorators(
    ApiDefaultResponse({
      description: 'Error Format',
      type: ResponseDto,
    }),
    // ApiOkResponse({
    //   description: 'Success Format',
    //   type: ResponseSuccessDto,
    // }),
    // ApiResponse({
    //   description: 'Success Format',
    //   type: ResponseSuccessDto,
    // }),
  );
}
