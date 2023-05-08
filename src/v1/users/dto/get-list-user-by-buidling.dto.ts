import { IntersectionType } from '@nestjs/mapped-types';
import { GetListDto } from '../../../dto/query.dto';
import { AttachBuildingIdDto } from '../../../dto/params.dto';

export class GetListUserByBuildingIdDto extends IntersectionType(
  GetListDto,
  AttachBuildingIdDto,
) {}
