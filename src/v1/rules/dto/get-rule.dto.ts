import { PartialType } from '@nestjs/mapped-types';
import { GetListDto } from '../../../dto/query.dto';

export class GetRuleDto extends PartialType(GetListDto) {}
