import { PartialType } from '@nestjs/mapped-types';
import { GetListDto } from '../../../dto/query.dto';
import { IsArray } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Transform } from 'class-transformer';

export class GetListGroupsDto extends PartialType(GetListDto) {}

export class GetListGroupByZoneArrayDto extends PartialType(GetListDto) {
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @Transform(({ value }) => value.split(','))
  zone: string[];
}
