
import { PartialType } from '@nestjs/swagger';
import { GetListDto } from '../../../utils/dto/query.dto';

export class GetRuleDto extends PartialType(GetListDto) {}
