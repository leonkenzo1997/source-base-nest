import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';
import { DeviceSetting } from '../../device-setting/entities/device-setting.entity';
import { DeviceType } from '../../device-types/entities/device-type.entity';
import { FloorEntity } from '../../floors/entities/floor.entity';
import { Group } from '../../groups/entities/group.entity';
import { ZoneEntity } from '../../zones/entities/zone.entity';
import {
  OPTION_SENSOR,
  protocolDevice,
  TYPE_LIGHT_BULB
} from '../devices.const';
import { GatewayManageAreaEntity } from './gateway-manage-area.entity';

@Entity({ name: 'devices' })
export class DevicesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
  })
  address: string;

  @Column({ default: true })
  bluetoothConnection: boolean;

  @Column({ default: true })
  lightingStatus: boolean;

  @Column({ nullable: true })
  timeActive: Date;

  @Column({ nullable: true })
  timeDeActive: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Building, (building) => building.devices)
  building: Building;

  @ManyToOne((type) => FloorEntity, (floor) => floor.devices)
  @JoinColumn({ name: 'floorId' })
  floor: FloorEntity;

  @Column({ nullable: true })
  floorId: number;

  @ManyToOne((type) => ZoneEntity, (zone) => zone.devices)
  @JoinColumn({ name: 'zoneId' })
  zone: ZoneEntity;

  @Column({ nullable: true })
  zoneId: number;

  @ManyToOne((type) => Group, (group) => group.devices)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Column({ nullable: true })
  groupId: number;

  @ManyToOne((type) => DeviceType, (deviceType) => deviceType.devices)
  @JoinColumn({ name: 'deviceTypeId' })
  deviceType: DeviceType;

  @Column({ nullable: true })
  deviceTypeId: number;

  @OneToOne((type) => DeviceSetting, (deviceSetting) => deviceSetting.device, {
    cascade: ['soft-remove', 'insert'],
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  deviceSetting: DeviceSetting;

  @OneToMany(
    (type) => GatewayManageAreaEntity,
    (gatewayManageArea) => gatewayManageArea.device,
    {
      cascade: ['soft-remove', 'insert'],
      nullable: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  gatewayManageArea: GatewayManageAreaEntity[];

  @Column({ type: 'enum', nullable: false, enum: protocolDevice })
  protocolDeviceId: number;

  @Column({ type: 'enum', nullable: true, enum: OPTION_SENSOR })
  option: string;

  @Column({ type: 'enum', nullable: true, enum: [1, 2] })
  positionGroup: number;

  @Column({ type: 'enum', nullable: true, enum: [true, false], default: false })
  masterSensor: boolean;

  @Column({ type: 'enum', nullable: true, enum: TYPE_LIGHT_BULB })
  typeLightBulb: number;
}
