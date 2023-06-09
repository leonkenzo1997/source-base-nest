import { IntersectionType, PartialType } from '@nestjs/swagger';
import { CreateSuperAdminDto } from './create-super-admin.dto';

export class CreateUserDto extends PartialType(CreateSuperAdminDto) {
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
