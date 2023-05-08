import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachGroupIdDto, AttachZoneIdDto } from './params.dto';

export class AttachNameDto {
  @IsString({
    message: i18nValidationMessage('validations.INVALID_STRING'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  name: string;
}

export class AttachZoneDto extends PartialType(AttachZoneIdDto) {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ValidateNested({ each: true })
  @Type(() => AttachGroupIdDto)
  group: AttachGroupIdDto[];
}

export class AttachSettingDto {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validations.MIN_BRIGHTNESS'),
  })
  @Max(100, {
    message: i18nValidationMessage('validations.MAX_BRIGHTNESS'),
  })
  brightness: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(2700, {
    message: i18nValidationMessage('validations.MIN_TONE'),
  })
  @Max(6500, {
    message: i18nValidationMessage('validations.MAX_TONE'),
  })
  tone: number;
}
