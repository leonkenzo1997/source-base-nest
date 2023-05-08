import { PartialType } from '@nestjs/mapped-types';
import { AttachDeviceTypeIdDto, AttachIdDto } from '../../../dto/params.dto';

export class ListOtaDto extends PartialType(AttachDeviceTypeIdDto) {}
export class NewOtaDeviceTypeDto extends PartialType(AttachDeviceTypeIdDto) {}
export class DetailOtaDto extends PartialType(AttachIdDto) {}
