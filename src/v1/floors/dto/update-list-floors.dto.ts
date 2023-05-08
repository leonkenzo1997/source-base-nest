import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachIdDto } from '../../../dto/params.dto';

export class UpdateListFloorDTO {
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttachIdDto)
  arrayFloors: AttachIdDto[];
}
