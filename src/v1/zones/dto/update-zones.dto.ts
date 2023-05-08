import { PartialType } from '@nestjs/mapped-types';
import { AttachNameDto } from '../../../dto/body.dto';

export class UpdateZonesDto extends PartialType(AttachNameDto) {}
