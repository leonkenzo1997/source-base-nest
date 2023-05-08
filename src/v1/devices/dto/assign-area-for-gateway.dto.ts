import { IntersectionType } from '@nestjs/mapped-types';
import {
  AttachDeviceIdDto,
  AttachFloorIdDto,
  AttachIdDto,
} from '../../../dto/params.dto';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';

export class AssignAreaForGatewayDto extends IntersectionType(
  AttachFloorIdDto,
  AttachDeviceIdDto,
) {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ValidateNested({ each: true })
  @Type(() => AttachIdDto)
  zone: AttachIdDto[];
}

