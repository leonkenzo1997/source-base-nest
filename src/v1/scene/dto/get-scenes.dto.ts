import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { GetListDto } from '../../../dto/query.dto';

export class GetScenesDto extends PartialType(GetListDto) {}

export class GetListSceneByBuildingDto extends PartialType(GetListDto) {
  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  floor: number;

  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validations.INVALID_BOOLEAN') })
  @Transform(({ obj, key }) => obj[key] === 'true')
  scheduleApplied: boolean;

  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public building: number;
}
