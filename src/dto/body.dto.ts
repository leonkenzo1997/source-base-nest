import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray, IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from "class-validator";
import { i18nValidationMessage } from 'nestjs-i18n';
// import { AttachGroupIdDto, AttachZoneIdDto } from './params.dto';

export class AttachNameDto {
  @IsString({
    message: i18nValidationMessage('validations.INVALID_STRING'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  name: string;
}

// export class AttachZoneDto extends PartialType(AttachZoneIdDto) {
//   @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
//   @IsArray({ message: i18nValidationMessage('validations.INVALID_ARRAY') })
//   @ValidateNested({ each: true })
//   @Type(() => AttachGroupIdDto)
//   group: AttachGroupIdDto[];
// }

export class RequestEncryptDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validations.INVALID_EMAIL'),
    },
  )
  @MaxLength(255, {
    message: i18nValidationMessage('validations.MAX_LENGTH_255'),
  })
  email: string;

  @MinLength(8, {
    message: i18nValidationMessage('validations.MIN_PASSWORD'),
  })
  @MaxLength(50, {
    message: i18nValidationMessage('validations.MAX_PASSWORD'),
  })
  @Matches(
    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])([a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,})$/,
    {
      message: i18nValidationMessage('validations.PASSWORD_WEAK'),
    },
  )
  password: string;

  @IsDate({ message: i18nValidationMessage('validations.INVALID_DATE') })
  requestTime: Date;
}

export class PageAndLimitDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

export class DataEncryptDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  dataEncrypt: string;
}
