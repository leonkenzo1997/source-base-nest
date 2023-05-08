import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  AttachFloorIdDto,
  AttachGroupIdDto,
  AttachZoneIdDto
} from '../../../dto/params.dto';
import { GetListDto } from '../../../dto/query.dto';

export class GetListDeviceForAdminDto extends IntersectionType(
  GetListDto,
  AttachFloorIdDto,
) {
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @Transform(({ value }) => value.split(','))
  deviceType: string[];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @Transform(({ value }) => value.split(','))
  zone: string[];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @Transform(({ value }) => value.split(','))
  group: string[];
}

export class GetListDeviceDto extends IntersectionType(
  GetListDto,
  AttachFloorIdDto,
  AttachGroupIdDto,
  AttachZoneIdDto,
) {}

export class GetListGateWayDeviceDto extends IntersectionType(
  GetListDto,
  AttachFloorIdDto,
) {}

export class GetListSensorSingleDto extends PartialType(GetListDto) {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  groupId: number;
}

export class GetListDeviceByGatewayDto extends PartialType(GetListDto) {
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @Transform(({ value }) => value.split(','))
  groupId: string[];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @Transform(({ value }) => value.split(','))
  zoneId: string[];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @Transform(({ value }) => value.split(','))
  deviceType: string[];

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('validations.TYPE_BOOLEAN'),
  })
  @Transform(({ obj, key }) => obj[key] === 'true')
  lightingStatus: boolean;
}
