import { PartialType } from '@nestjs/mapped-types';
import { AttachIdDto, AttachZoneIdDto } from '../../../dto/params.dto';
import { IsArray } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { Transform } from "class-transformer";

export class ParamGroupZoneIdDto extends PartialType(AttachZoneIdDto) {}
export class ParamGroupDetailDto extends PartialType(AttachIdDto) {}
