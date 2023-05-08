import {
    IsNotEmpty, IsNumberString,
    IsString, MaxLength,
    MinLength
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateInformationCompanyDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public info: string;

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public address: string;

  @IsNumberString({
    message: i18nValidationMessage(
      'validations.PHONE_NUMBER_TYPE_NUMBER_STRING',
    ),
  })
  @MaxLength(12, {
    message: i18nValidationMessage('validations.PHONE_NUMBER_MAX'),
  })
  @MinLength(10, {
    message: i18nValidationMessage('validations.PHONE_NUMBER_MIN'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public tel: string;

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public copyright: string;

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public etc: string;
}
