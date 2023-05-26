import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachRuleDto } from '../../rules/dto/attach-rule.dto';
import { UserRole } from '../user.const';

export class CreateUserDto {
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

  // @IsOptional()
  // @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  // @ArrayMinSize(1)
  // @ValidateNested()
  // rules: AttachRuleDto[];

  // @IsNumber(
  //   {},
  //   {
  //     message: i18nValidationMessage('validations.INVALID_NUMBER'),
  //   },
  // )
  // @IsIn(Object.values(UserRole))
  // roleId: UserRole;

  // @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  // @IsOptional()
  // fullName: string;

  // @IsNumberString({
  //   message: i18nValidationMessage(
  //     'validations.PHONE_NUMBER_TYPE_NUMBER_STRING',
  //   ),
  // })
  // @IsOptional()
  // @MaxLength(12, {
  //   message: i18nValidationMessage('validations.PHONE_NUMBER_MAX'),
  // })
  // @MinLength(10, {
  //   message: i18nValidationMessage('validations.PHONE_NUMBER_MIN'),
  // })
  // phoneNumber: string;
}
