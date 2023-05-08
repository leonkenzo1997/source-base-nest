import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
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

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  password: string;

  @IsBoolean({
    message: i18nValidationMessage('validations.TYPE_BOOLEAN'),
  })
  // @IsBooleanString({
  //   message: i18nValidationMessage('validations.TYPE_BOOLEAN'),
  // })
  @IsOptional()
  isSaved: boolean;
}