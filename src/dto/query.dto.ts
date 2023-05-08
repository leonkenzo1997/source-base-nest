import { IntersectionType } from '@nestjs/mapped-types';
import { KeywordDto, PaginationDto } from '../utils/dto/pagination.dto';

export class GetListDto extends IntersectionType(
  PaginationDto,
  KeywordDto,
) {}
