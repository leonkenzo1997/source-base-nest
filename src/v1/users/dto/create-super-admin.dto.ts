import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateSuperAdminDto {
  @IsString({
    message: i18nValidationMessage('validations.INVALID_STRING'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_EMAIL'),
    },
  )
  @MaxLength(255, {
    message: i18nValidationMessage('validations.MAX_LENGTH_255'),
  })
  email: string;

  @IsString({
    message: i18nValidationMessage('validations.INVALID_STRING'),
  })
  @MinLength(8, {
    message: i18nValidationMessage('validations.MIN_PASSWORD'),
  })
  @MaxLength(50, {
    message: i18nValidationMessage('validations.MAX_PASSWORD'),
  })
  @Matches(
    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])([a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,})$/,
    {
      message: i18nValidationMessage('validations.PASSWORD_WEAK'),
    },
  )
  password: string;
}
