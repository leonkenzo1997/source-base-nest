import { PartialType } from '@nestjs/mapped-types';
import { CreateUserBuildingDto } from './create-users-buildings.dto';

export class UpdateUserBuildingDto extends PartialType(CreateUserBuildingDto) {}
