import { IsIn, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserRule } from '../rule.const';
import { ApiProperty } from '@nestjs/swagger';

export class AttachRuleDto {
  @ApiProperty()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsIn(Object.values(UserRule))
  id: UserRule;
}
