import { PartialType } from '@nestjs/mapped-types';
import { AttachNameDto } from '../../../dto/body.dto';
/* eslint-disable prettier/prettier */

export class EditNameFloorDTO extends PartialType(AttachNameDto) {}
