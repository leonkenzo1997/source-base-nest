import { IntersectionType } from '@nestjs/swagger';
import { KeywordDto, PaginationDto } from './pagination.dto';


export class GetListDto extends IntersectionType(PaginationDto, KeywordDto) {}