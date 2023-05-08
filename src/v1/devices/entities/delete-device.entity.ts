import { FloorEntity } from '../../floors/entities/floor.entity';
import { Group } from '../../groups/entities/group.entity';
import { ZoneEntity } from '../../zones/entities/zone.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { protocolDevice } from '../devices.const';
import { DeviceType } from '../../device-types/entities/device-type.entity';

@Entity({ name: 'delete_device' })
export class DeleteDevices extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', nullable: false, enum: protocolDevice })
  protocolDeviceId: number;

  @ManyToOne((type) => FloorEntity, (floor) => floor.deleteDevices)
  @JoinColumn({ name: 'floorId' })
  floor: FloorEntity;

  @Column({ nullable: true })
  floorId: number;

  @ManyToOne((type) => ZoneEntity, (zone) => zone.deleteDevices)
  @JoinColumn({ name: 'zoneId' })
  zone: ZoneEntity;

  @Column({ nullable: true })
  zoneId: number;

  @ManyToOne((type) => Group, (group) => group.deleteDevices)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Column({ nullable: true })
  groupId: number;

  @ManyToOne((type) => DeviceType, (deviceType) => deviceType.devices)
  @JoinColumn({ name: 'deviceTypeId' })
  deviceType: DeviceType;

  @Column({ nullable: true })
  deviceTypeId: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
