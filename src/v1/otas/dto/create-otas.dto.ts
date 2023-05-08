import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
export class CreateOtaDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @MinLength(3, {
    message: i18nValidationMessage('validations.INVALID_FILE_NAME'),
  })
  @MaxLength(63, {
    message: i18nValidationMessage('validations.INVALID_FILE_NAME'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public fileName: string;

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @Matches(/^(?!\.)(?!.\.$)(?!.\.\.)[0-9_.]+$/, {
    message: i18nValidationMessage('validations.INVALID_VERSION'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public version: string;

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public note: string;

  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public deviceType: number;
}
