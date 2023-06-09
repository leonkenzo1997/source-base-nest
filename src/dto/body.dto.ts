import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
// import { AttachGroupIdDto, AttachZoneIdDto } from './params.dto';

export class AttachNameDto {
  @ApiProperty()
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
  @ApiProperty({
    example: 'name@gmail.com'
  })
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

  @ApiProperty()
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

  @ApiProperty()
  @IsDate({ message: i18nValidationMessage('validations.INVALID_DATE') })
  requestTime: Date;
}

export class PageAndLimitDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

export class DataEncryptDto {
  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  dataEncrypt: string;
}
