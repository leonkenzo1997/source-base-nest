import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachSettingDto } from '../../../dto/body.dto';
import { SENSITIVITY_OPTION } from '../../device-setting/device-setting.const';
import { UpdateLightOptimizationModeDto } from '../../device-setting/dto/body-device-setting.dto';
import { AttachDeviceIdDto } from './../../../dto/params.dto';

export class UpdateGroupsDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @MaxLength(255, {
    message: i18nValidationMessage('validations.MAX_LENGTH_255'),
  })
  name: string;
}

export class UpdateGroupSettingDto extends PartialType(AttachSettingDto) {}

export class UpdateGroupSensorSettingDto {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0.1, {
    message: i18nValidationMessage('validations.MIN_FADE_IN'),
  })
  @Max(25.5, {
    message: i18nValidationMessage('validations.MAX_FADE_MAX'),
  })
  fadeInTime: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0.1, {
    message: i18nValidationMessage('validations.MIN_FADE_OUT'),
  })
  @Max(25.5, {
    message: i18nValidationMessage('validations.MAX_FADE_OUT'),
  })
  fadeOutTime: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(1, {
    message: i18nValidationMessage('validations.MIN_BRIGHTNESS_RETENTION_TIME'),
  })
  @Max(65.535, {
    message: i18nValidationMessage('validations.MAX_BRIGHTNESS_RETENTION_TIME'),
  })
  brightnessRetentionTime: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsIn(Object.values(SENSITIVITY_OPTION))
  @Min(3, {
    message: i18nValidationMessage('validations.MIN_SENSOR_SENSITIVITY'),
  })
  @Max(5, {
    message: i18nValidationMessage('validations.MAX_SENSOR_SENSITIVITY'),
  })
  sensorSensitivity: SENSITIVITY_OPTION;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0.5, {
    message: i18nValidationMessage('validations.MIN_RECOGNIZING_CYCLE_TIME'),
  })
  @Max(8, {
    message: i18nValidationMessage('validations.MAX_RECOGNIZING_CYCLE_TIME'),
  })
  recognizingCycleTime: number;
}

export class UpdateGroupLightOptimizationModeDto {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  optimization: UpdateLightOptimizationModeDto;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ValidateNested({ each: true })
  @Type(() => AttachDeviceIdDto)
  @ArrayMaxSize(1, {
    message: i18nValidationMessage(
      'validations.ONE_MASTER_SMART_SENSOR_REGISTER_IN_GROUP',
    ),
  })
  masterSensor: AttachDeviceIdDto[];
}
