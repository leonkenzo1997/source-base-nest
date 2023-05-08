import { IntersectionType } from '@nestjs/mapped-types';
import { AttachBuildingIdDto, AttachUserIdDto } from '../../../dto/params.dto';
import { GetListDto } from '../../../dto/query.dto';

export class GetListFloorByBuildingDTO extends IntersectionType(
  GetListDto,
  AttachBuildingIdDto,
) {}

export class GetListFloorByUserDTO extends IntersectionType(
  GetListDto,
  AttachBuildingIdDto,
  AttachUserIdDto,
) {}
