import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty, ValidateNested
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  AttachNameDto,
  AttachSettingDto, AttachZoneDto
} from '../../../dto/body.dto';

export class CreateSceneSettingDto extends IntersectionType(
  // field name
  AttachNameDto,
  // field setting as tone, brightness
  AttachSettingDto,
) {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsBoolean({ message: i18nValidationMessage('validations.TYPE_BOOLEAN') })
  status: boolean;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ValidateNested({ each: true })
  @Type(() => AttachZoneDto)
  // attachAreaDto contain field as floorId, zoneId, groupId
  zone: AttachZoneDto[];
}
