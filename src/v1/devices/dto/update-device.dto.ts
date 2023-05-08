import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachNameDto } from '../../../dto/body.dto';
import { AttachIdDto } from '../../../dto/params.dto';

export class UpdateDeviceDto {
  @IsString({
    message: i18nValidationMessage('validations.INVALID_STRING'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  address: string;
}

export class ChangeNameDeviceDto extends IntersectionType(
  AttachIdDto,
  AttachNameDto,
) {}
