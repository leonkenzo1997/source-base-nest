import { PartialType } from '@nestjs/mapped-types';
import { AttachDeviceIdDto, AttachFloorIdDto, AttachIdDto } from '../../../dto/params.dto';

export class ParamSceneDetailDto extends PartialType(AttachIdDto) {}

export class ParamSceneFloorIdDto extends PartialType(AttachFloorIdDto) {}
export class ParamSceneDeviceDto extends PartialType(AttachDeviceIdDto) {}
