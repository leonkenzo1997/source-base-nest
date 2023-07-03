import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachIdDto } from '../../../utils/dto/params.dto';

export class DeleteMultipleAccountDto {
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {
    message: i18nValidationMessage('validations.MIN_ARRAY'),
  })
  @Type(() => AttachIdDto)
  @ApiProperty({
    example: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
    type: AttachIdDto,
  })
  usersArray: AttachIdDto[];
}
