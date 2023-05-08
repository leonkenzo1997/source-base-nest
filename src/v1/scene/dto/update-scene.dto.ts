import { PartialType } from '@nestjs/mapped-types';
import { AttachNameDto } from 'src/dto/body.dto';

export class UpdateSceneDto extends PartialType(AttachNameDto) {}
