import { AttachFloorIdDto } from './../../../dto/params.dto';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { GetListDto } from '../../../dto/query.dto';

export class GetZonesDto extends PartialType(GetListDto) {}
export class GetZonesGatewayDto extends IntersectionType(GetListDto,AttachFloorIdDto) {}
