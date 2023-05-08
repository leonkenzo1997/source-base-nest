import { AttachIdDto } from '../../../dto/params.dto';
export class CreateUserBuildingFloorDto {
  building: AttachIdDto;
  user: AttachIdDto;
  floor: AttachIdDto;
}
