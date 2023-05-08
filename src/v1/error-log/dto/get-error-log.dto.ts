import { PartialType } from '@nestjs/mapped-types';
import { GetListDto } from '../../../dto/query.dto';

export class GetErrorLogDto extends PartialType(GetListDto) {}