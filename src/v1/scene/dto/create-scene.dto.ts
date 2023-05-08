import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachNameDto } from '../../../dto/body.dto';
import { CreateSceneSettingDto } from '../../scene-setting/dto/create-scene-setting.dto';
import { AttachFloorIdDto } from '../../../dto/params.dto';

export class CreateSceneDto extends IntersectionType(
  AttachNameDto,
  AttachFloorIdDto,
) {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ValidateNested({ each: true })
  @Type(() => CreateSceneSettingDto)
  sceneSettings: CreateSceneSettingDto[];
}
