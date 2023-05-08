/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateFloorDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public name: string;
}
