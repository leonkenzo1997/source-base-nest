import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeleteDevices } from '../../devices/entities/delete-device.entity';
import { DevicesEntity } from '../../devices/entities/device.entity';
import { FloorEntity } from '../../floors/entities/floor.entity';
import { Group } from '../../groups/entities/group.entity';
import { SceneSettingArea } from '../../scene-setting-area/entities/scene-setting-area.entity';
import { protocolZone } from '../zones.const';
import { DeleteGroup } from '../../groups/entities/delete-group.entity';
import { GatewayManageAreaEntity } from "../../devices/entities/gateway-manage-area.entity";

@Entity({ name: 'zones' })
export class ZoneEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column({ default: false })
  deleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', nullable: false, enum: protocolZone })
  protocolZoneId: number;

  @ManyToOne((type) => FloorEntity, (floor) => floor.zones, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  floor: FloorEntity;

  @Column({ nullable: false })
  buildingId: number;

  @OneToMany((type) => Group, (group) => group.zone, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  groups: Group[];

  @OneToMany((type) => DeleteGroup, (group) => group.zone, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  deleteGroup: DeleteGroup[];

  @OneToMany((type) => DevicesEntity, (device) => device.zone, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  devices: DevicesEntity[];

  @OneToMany(
    (type) => SceneSettingArea,
    (sceneSettingArea) => sceneSettingArea.zone,
    {
      cascade: ['insert', 'soft-remove'],
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  sceneSettingArea: SceneSettingArea[];

  @OneToMany((type) => DeleteDevices, (deleteDevices) => deleteDevices.zone, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  deleteDevices: DeleteDevices[];

  @OneToMany(
    (type) => GatewayManageAreaEntity,
    (gatewayManageArea) => gatewayManageArea.zone,
    {
      cascade: ['soft-remove'],
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  gatewayManageArea: GatewayManageAreaEntity[];
}
