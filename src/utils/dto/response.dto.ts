import { ApiProperty, PartialType } from '@nestjs/swagger';
import { METHOD } from '../constant/response.const';

export class ResponseDto {
  @ApiProperty({
    isArray: true,
    type: String,
  })
  message: any[];

  @ApiProperty()
  statusName: string;

  @ApiProperty({
    type: String,
  })
  statusCodeMsg: any;

  @ApiProperty({
    type: String,
  })
  statusCode: any;

  @ApiProperty()
  module: string;

  @ApiProperty()
  method: string;
}

export class ResponseAuthorizedDto extends PartialType(ResponseDto) {
  @ApiProperty({
    isArray: true,
    type: String,
    default: ['Unauthorized']
  })
  message: any[];
}

export class ResponseSuccessDto {
  @ApiProperty()
  data: object;

  @ApiProperty()
  message: string;
}

export class ResponseGetDto extends PartialType(ResponseDto) {
  @ApiProperty({
    enum: Object.values(METHOD),
    default: METHOD.GET,
  })
  method: string;
}

export class ResponsePostDto extends PartialType(ResponseDto) {
  @ApiProperty({
    enum: Object.values(METHOD),
    default: METHOD.POST,
  })
  method: string;
}

export class ResponseDeleteDto extends PartialType(ResponseDto) {
  @ApiProperty({
    enum: Object.values(METHOD),
    default: METHOD.DELETE,
  })
  method: string;
}

export class ResponsePutDto extends PartialType(ResponseDto) {
  @ApiProperty({
    enum: Object.values(METHOD),
    default: METHOD.PUT,
  })
  method: string;
}

export class ResponsePatchDto extends PartialType(ResponseDto) {
  @ApiProperty({
    enum: Object.values(METHOD),
    default: METHOD.PATCH,
  })
  method: string;
}
