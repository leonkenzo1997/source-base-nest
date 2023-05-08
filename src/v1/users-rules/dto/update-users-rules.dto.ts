import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty, ValidateNested
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachIdDto } from 'src/dto/params.dto';

export class UpdateUsersRulesDto {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ValidateNested({ each: true })
  @Type(() => AttachIdDto)
  rulesIds: AttachIdDto[];
}
