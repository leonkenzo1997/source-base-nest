import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateButtonPositionDto {

  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validations.MIN_BUTTON_POSITION'),
  })
  @Max(5, {
    message: i18nValidationMessage('validations.MAX_BUTTON_POSITION'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public buttonPosition: number;
}
