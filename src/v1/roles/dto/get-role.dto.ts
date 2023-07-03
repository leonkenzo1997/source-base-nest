
import { PartialType } from '@nestjs/swagger';
import { GetListDto } from '../../../utils/dto/query.dto';

export class GetRoleDto extends PartialType(GetListDto) {}
