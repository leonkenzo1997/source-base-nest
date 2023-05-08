import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateErrorLogDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @MaxLength(255, {
    message: i18nValidationMessage('validations.MAX_LENGTH_255'),
  })
  errorId: string;

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @MaxLength(255, {
    message: i18nValidationMessage('validations.MAX_LENGTH_255'),
  })
  type: string;

  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  building: number;

}
