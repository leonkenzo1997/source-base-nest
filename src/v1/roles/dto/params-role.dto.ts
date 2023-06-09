import { PartialType } from '@nestjs/swagger';
import { AttachIdDto } from '../../../dto/params.dto';

export class ParamRoleDetailDto extends PartialType(AttachIdDto) {}
