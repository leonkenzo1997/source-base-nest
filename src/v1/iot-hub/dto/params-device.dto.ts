import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ParamDeviceDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  deviceId: string;
}
