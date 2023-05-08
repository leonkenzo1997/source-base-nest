import { IntersectionType } from '@nestjs/mapped-types';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachNameDto } from '../../../dto/body.dto';
import { AttachFloorIdDto, AttachSceneIdDto } from '../../../dto/params.dto';
import { ScheduleType } from '../schedule.const';

export class CreateScheduleDto extends IntersectionType(
  // field name
  AttachNameDto,
  AttachFloorIdDto,
  AttachSceneIdDto,
) {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsIn(Object.values(ScheduleType))
  type?: ScheduleType;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validations.MIN_HOURS'),
  })
  @Max(24, {
    message: i18nValidationMessage('validations.MAX_HOURS'),
  })
  hours: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validations.MIN_MINUTES'),
  })
  @Max(60, {
    message: i18nValidationMessage('validations.MAX_MINUTES'),
  })
  minutes: number;

  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validations.MIN_DAY_OF_WEEK'),
  })
  @Max(60, {
    message: i18nValidationMessage('validations.MAX_DAY_OF_WEEK'),
  })
  @IsOptional()
  dayOfWeek: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(1, {
    message: i18nValidationMessage('validations.MIN_DATE'),
  })
  @Max(31, {
    message: i18nValidationMessage('validations.MAX_DATE'),
  })
  @IsOptional()
  date: number;

  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validations.MIN_MONTHS'),
  })
  @Max(12, {
    message: i18nValidationMessage('validations.MAX_MONTHS'),
  })
  @IsOptional()
  months: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  years: number;
}
