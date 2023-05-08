import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachSettingDto } from '../../../dto/body.dto';
import { UpdateGroupSensorSettingDto } from '../../groups/dto/update-group.dto';

export class UpdateDeviceSettingDto extends PartialType(AttachSettingDto) {}

export class UpdateSensorSettingDto extends PartialType(
  UpdateGroupSensorSettingDto,
) {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(1, {
    message: i18nValidationMessage('validations.MIN_PERCEPTION'),
  })
  @Max(100, {
    message: i18nValidationMessage('validations.MAX_PERCEPTION'),
  })
  perception: number;

  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validations.MIN_NOT_PERCEPTION'),
  })
  @Max(99, {
    message: i18nValidationMessage('validations.MAX_NOT_PERCEPTION'),
  })
  notPerception: number;
}
