import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PaginationDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  page: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  limit: number = 10;

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsOptional()
  @IsIn(Object.values(['ASC', 'DESC']))
  sortType: 'ASC' | 'DESC' = 'DESC';

  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsOptional()
  sortBy: string;
}

export class KeywordDto {
  @IsString({ message: i18nValidationMessage('validations.INVALID_STRING') })
  @IsOptional()
  keyword: string;
}
