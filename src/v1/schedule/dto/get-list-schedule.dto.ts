import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { GetListDto } from '../../../dto/query.dto';

export class GetListScheduleDto extends PartialType(GetListDto) {
  @IsOptional()
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
  type: number;
}

export class GetListScheduleForMobileDto extends IntersectionType(
  GetListDto,
  GetListScheduleDto,
) {
  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  buildingId: number;
}

export class GetListScheduleForWebDto extends IntersectionType(
  GetListDto,
  GetListScheduleDto,
) {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  buildingId: number;
}
