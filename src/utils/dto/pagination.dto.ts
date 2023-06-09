import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PaginationDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  @ApiProperty()
  page: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  @ApiProperty()
  limit: number = 10;

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsOptional()
  @IsIn(Object.values(['ASC', 'DESC']))
  @ApiProperty()
  sortType: 'ASC' | 'DESC' = 'DESC';

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsOptional()
  @ApiProperty()
  sortBy: string;
}

export class KeywordDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsOptional()
  @ApiProperty()
  keyword: string;
}
