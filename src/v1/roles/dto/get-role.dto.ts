
import { PartialType } from '@nestjs/swagger';
import { GetListDto } from '../../../dto/query.dto';

export class GetRoleDto extends PartialType(GetListDto) {}
