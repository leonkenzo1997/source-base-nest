import { PartialType } from '@nestjs/swagger';
import { AttachIdDto } from '../../../utils/dto/params.dto';

export class ParamRoleDetailDto extends PartialType(AttachIdDto) {}
