import { PartialType } from '@nestjs/mapped-types';
import { CreateOtaDto } from './create-otas.dto';

export class UpdateOtaDto extends PartialType(CreateOtaDto) {}
