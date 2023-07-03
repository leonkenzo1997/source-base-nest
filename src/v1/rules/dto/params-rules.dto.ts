import { PartialType } from '@nestjs/swagger';
import { AttachIdDto, AttachUserIdDto } from '../../../utils/dto/params.dto';

export class ParamRuleUserIdDto extends PartialType(AttachUserIdDto) {}

export class ParamRuleDetailDto extends PartialType(AttachIdDto) {}
