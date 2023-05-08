import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachNameDto } from '../../../dto/body.dto';

export class CreateZonesDto extends PartialType(AttachNameDto) {
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  public floor: number;
}
