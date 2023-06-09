import { PartialType, PickType } from '@nestjs/swagger';
import { AttachIdDto } from '../../../dto/params.dto';
import { CreateSuperAdminDto } from './create-super-admin.dto';

export class ParamUserDetailDto extends PartialType(AttachIdDto) {}

const FIELD_PICK = [];
const EMAIL = 'email';
FIELD_PICK.push(EMAIL);
export class CheckEmailDto extends PickType(CreateSuperAdminDto, FIELD_PICK) {}
