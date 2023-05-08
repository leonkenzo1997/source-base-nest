import { PartialType } from '@nestjs/mapped-types';
import { CreateUserBuildingFloorDto } from './create-users-buildings-floors.dto';

export class UpdateUserBuildingFloorDto extends PartialType(CreateUserBuildingFloorDto) {}
