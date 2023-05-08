import { IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateRuleDto {
  @MaxLength(320, {
    message: i18nValidationMessage('validations.MIX_LENGTH_320'),
  })
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  name: string;
}
