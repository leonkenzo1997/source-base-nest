import { PartialType } from '@nestjs/mapped-types';
import { AttachAddressDto, AttachDeviceIdDto } from "../../../dto/params.dto";

export class ParamsAddressDto extends PartialType(AttachAddressDto) {}
