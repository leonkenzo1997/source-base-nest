import { IsIn, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserRule } from '../rule.const';

export class AttachRuleDto {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsIn(Object.values(UserRule))
  id: UserRule;
}
