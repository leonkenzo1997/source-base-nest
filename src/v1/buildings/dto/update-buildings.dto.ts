import { AttachNameDto } from 'src/dto/body.dto';
/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { GatewayStatus } from '../buildings.const';

export class UpdateBuildingDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsOptional()
  public name: string;

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsOptional()
  public address: string;

  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsIn(Object.values(GatewayStatus), {
    message: i18nValidationMessage('validations.INVALID_DATA'),
  })
  @IsOptional()
  public status: number;
}

export class CheckNameBuildingDto extends PartialType(AttachNameDto) {}
