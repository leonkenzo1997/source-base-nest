/* eslint-disable prettier/prettier */
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { i18nValidationMessage } from 'nestjs-i18n';
import { GatewayStatus } from '../buildings.const';

export class CreateBuildingDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public name: string;

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
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
