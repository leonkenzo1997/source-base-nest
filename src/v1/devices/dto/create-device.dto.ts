import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachNameDto } from '../../../dto/body.dto';
import { DeviceType } from '../../device-types/device-types.const';
import { AttachIdDto } from './../../../dto/params.dto';
import { OPTION_SENSOR } from './../devices.const';

export class CreateDeviceDto {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ValidateNested({ each: true })
  @Type(() => listDevice)
  listDevice: listDevice[];
}

export class listDevice extends PartialType(AttachNameDto) {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  address: string;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  floorId: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  zoneId: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  groupId?: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  typeLightBulb: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsIn(Object.values(DeviceType))
  deviceType: DeviceType;
}

export class ListDeviceSensorDto extends PartialType(AttachNameDto) {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  address: string;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  floorId: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  zoneId: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsIn(Object.values(DeviceType))
  deviceType: DeviceType;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsEnum(Object.values(OPTION_SENSOR), {
    message: i18nValidationMessage('validations.INVALID_OPTION_SENSOR'),
  })
  option: string;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ValidateNested({ each: true })
  @Type(() => listGroup)
  @ArrayMaxSize(2, {
    message: i18nValidationMessage('validations.NUMBER_GROUP_SENSOR'),
  })
  @ArrayMinSize(1, {
    message: i18nValidationMessage('validations.NUMBER_GROUP_SENSOR'),
  })
  group: listGroup[];
}

export class CreateDeviceSensorDto {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ValidateNested({ each: true })
  @Type(() => ListDeviceSensorDto)
  listDevice: ListDeviceSensorDto[];
}

export class listGroup extends PartialType(AttachIdDto) {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsEnum([1, 2], {
    message: i18nValidationMessage('validations.NUMBER_POSITION_GROUP_SENSOR'),
  })
  positionGroup: number;
}
