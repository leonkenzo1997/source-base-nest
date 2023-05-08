import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachIdDto } from '../../../dto/params.dto';

export class ParamDetailDeviceDto extends PartialType(AttachIdDto) {}

export class ParamGatewayDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  gatewayId: number;
}
