import { IntersectionType } from '@nestjs/mapped-types';
import { AttachUserIdDto } from '../../../dto/params.dto';
import { GetListDto } from '../../../dto/query.dto';

export class GetUserBuildingFloorByUserIdDto extends IntersectionType(
  GetListDto,
  AttachUserIdDto,
) {}
