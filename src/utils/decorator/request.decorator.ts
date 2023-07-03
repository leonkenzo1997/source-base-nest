import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiDefaultResponse, ApiHeader } from '@nestjs/swagger';
import { ResponseDto } from '../dto/response.dto';

export function RequestFormat() {
  return applyDecorators(
    // ApiDefaultResponse({
    //   description: 'Error Format',
    //   type: ResponseDto,
    // }),
    ApiHeader({
        name: 'Accept-Language',
        description: 'Change language. Please choose value en or kr',
        required: true,
        // deprecated: false,
        // allowEmptyValue: false,
        example: 'en',
      })
  );
}
