import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'name@gmail.com',
    format: 'email'
  })
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

  @ApiProperty({
    description: 'password is string'
  })
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  password: string;

  @ApiProperty({
    default: false
  })
  @IsBoolean({
    message: i18nValidationMessage('validations.TYPE_BOOLEAN'),
  })
  // @IsBooleanString({
  //   message: i18nValidationMessage('validations.TYPE_BOOLEAN'),
  // })
  @IsOptional()
  isSaved: boolean;
}
