import { IsIn, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { RoleName } from '../roles.const';


export class CreateRoleDto {
  @MaxLength(255, {
    message: i18nValidationMessage('validations.MAX_LENGTH_255'),
  })
  @IsIn(Object.values(RoleName))
  name: RoleName;
}
