import { IntersectionType } from '@nestjs/mapped-types';
import { AttachBuildingIdDto } from '../../../dto/params.dto';
import { GetListDto } from '../../../dto/query.dto';

export class GetUserBuildingFloorByBuildingIdDto extends IntersectionType(
  GetListDto,
  AttachBuildingIdDto,
) {}
