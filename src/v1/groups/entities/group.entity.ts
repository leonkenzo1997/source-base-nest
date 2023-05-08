import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { DeleteDevices } from '../../devices/entities/delete-device.entity';
import { DevicesEntity } from '../../devices/entities/device.entity';
import { SceneSettingArea } from '../../scene-setting-area/entities/scene-setting-area.entity';
import { ZoneEntity } from '../../zones/entities/zone.entity';
import { DeviceSetting } from "../../device-setting/entities/device-setting.entity";
import { GroupSetting } from './group-setting.entity';

@Entity({ name: 'groups' })
export class Group extends BaseEntity {
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

  @ManyToOne((type) => ZoneEntity, (zone) => zone.groups, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'zoneId' })
  zone: ZoneEntity;

  @Column({ nullable: true })
  zoneId: number;

  @OneToMany(
    (type) => SceneSettingArea,
    (sceneSettingArea) => sceneSettingArea.group,
    {
      cascade: ['insert', 'soft-remove'],
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  sceneSettingArea: SceneSettingArea[];

  @OneToMany((type) => DevicesEntity, (device) => device.group, {
    cascade: ['insert', 'soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  devices: DevicesEntity[];

  @Column({ type: 'int', nullable: false })
  floorId: number;

  @Column({ type: 'int', nullable: false })
  buildingId: number;

  @Column({ type: 'enum', nullable: false, enum: [1, 2, 3, 4, 5] })
  protocolGroupId: number;

  @OneToMany((type) => DeleteDevices, (deleteDevices) => deleteDevices.group, {
    cascade: ['insert', 'soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  deleteDevices: DeleteDevices[];

  @Column({
    type: 'enum',
    nullable: false,
    enum: [0, 1, 2, 3, 4, 5],
    default: 0,
  })
  buttonPosition: string;

  @OneToOne((type) => GroupSetting, (groupSetting) => groupSetting.group, {
    cascade: ['soft-remove', 'insert','update'],
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  groupSetting: GroupSetting;
}
