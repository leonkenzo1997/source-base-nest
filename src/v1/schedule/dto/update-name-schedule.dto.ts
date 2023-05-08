import { PartialType } from '@nestjs/mapped-types';
import { AttachNameDto } from '../../../dto/body.dto';

export class UpdateNameScheduleDto extends PartialType(AttachNameDto) {}
