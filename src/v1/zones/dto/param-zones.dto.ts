import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachFloorIdDto, AttachIdDto } from '../../../dto/params.dto';

export class ParamZoneDetailDto extends PartialType(AttachIdDto) {}

export class ParamZoneFloorIdDto extends PartialType(AttachFloorIdDto) {}

export class ParamZoneGatewayIdDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  gatewayId: number;
}
