import { PartialType } from '@nestjs/mapped-types';
import { AttachIdDto } from '../../../dto/params.dto';

export class ParamFloorDetailDto extends PartialType(AttachIdDto) {}
