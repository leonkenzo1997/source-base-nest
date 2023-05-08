import { PartialType } from '@nestjs/mapped-types';
import { AttachIdDto, AttachSceneIdDto } from '../../../dto/params.dto';

export class ParamSceneIdDto extends PartialType(AttachSceneIdDto) {}
export class ParamSceneSettingDetailDto extends PartialType(AttachIdDto) {}
