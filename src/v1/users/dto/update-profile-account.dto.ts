import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateProfileAccountDto {
  @ApiProperty()
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validations.INVALID_STRING'),
  })
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validations.INVALID_STRING'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_EMAIL'),
    },
  )
  @MaxLength(320, {
    message: i18nValidationMessage('validations.MAX_LENGTH_320'),
  })
  emailContact: string;

  @ApiProperty()
  @IsNumberString({
    message: i18nValidationMessage(
      'validations.PHONE_NUMBER_TYPE_NUMBER_STRING',
    ),
  })
  @IsOptional()
  @MaxLength(12, {
    message: i18nValidationMessage('validations.PHONE_NUMBER_MAX'),
  })
  @MinLength(10, {
    message: i18nValidationMessage('validations.PHONE_NUMBER_MIN'),
  })
  phoneNumber: string;
}
