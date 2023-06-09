import { IntersectionType } from '@nestjs/swagger';
import { KeywordDto, PaginationDto } from '../utils/dto/pagination.dto';

export class GetListDto extends IntersectionType(PaginationDto, KeywordDto) {}
