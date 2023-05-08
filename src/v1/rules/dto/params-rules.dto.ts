import { PartialType } from '@nestjs/mapped-types';
import { AttachIdDto, AttachUserIdDto } from '../../../dto/params.dto';

export class ParamRuleUserIdDto extends PartialType(AttachUserIdDto) {}

export class ParamRuleDetailDto extends PartialType(AttachIdDto) {}
