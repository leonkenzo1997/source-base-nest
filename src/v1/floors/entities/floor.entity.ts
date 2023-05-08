import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeleteDevices } from '../../devices/entities/delete-device.entity';
import { DevicesEntity } from '../../devices/entities/device.entity';
import { SceneSettingArea } from '../../scene-setting-area/entities/scene-setting-area.entity';
import { DeleteScene } from '../../scene/entities/delete-scene.entity';
import { Scene } from '../../scene/entities/scene.entity';
import { DeleteSchedule } from '../../schedule/entities/delete-schedule.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { UserBuildingFloor } from '../../users-buildings-floors/entities/user-building-floor.entity';
import { User } from '../../users/entities/user.entity';
import { DeleteZone } from '../../zones/entities/delete-zone.entity';
import { ZoneEntity } from '../../zones/entities/zone.entity';
import { GatewayManageAreaEntity } from "../../devices/entities/gateway-manage-area.entity";

@Entity({ name: 'floors' })
export class FloorEntity extends BaseEntity {
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

  // assign building id for user-building-floor table
  @OneToMany(
    (type) => UserBuildingFloor,
    (usersBuildingsFloors) => usersBuildingsFloors.floor,
    {
      cascade: ['insert', 'soft-remove'],
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  usersBuildingsFloors: UserBuildingFloor[];

  @OneToMany(
    (type) => SceneSettingArea,
    (sceneSettingArea) => sceneSettingArea.floor,
    {
      cascade: ['insert', 'soft-remove'],
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  sceneSettingArea: SceneSettingArea[];

  @Column('varchar', { nullable: true })
  provisionKey: string;

  @OneToMany((type) => ZoneEntity, (zones) => zones.floor, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  zones: ZoneEntity[];

  @OneToMany((type) => Schedule, (schedule) => schedule.floor, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  schedules: Schedule[];

  @OneToMany(
    (type) => DeleteSchedule,
    (deleteSchedule) => deleteSchedule.floor,
    {
      nullable: false,
      cascade: ['insert', 'soft-remove', 'update', 'recover'],
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  deleteSchedule: Schedule[];

  @OneToMany((type) => Scene, (scene) => scene.floor, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scene: Scene[];

  @OneToMany((type) => DeleteScene, (deleteScene) => deleteScene.floor, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  deleteScene: DeleteScene[];

  @OneToMany((type) => DevicesEntity, (device) => device.floor, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  devices: DevicesEntity[];

  // relationship with user table
  @ManyToOne((type) => User, (user) => user.floors)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @OneToMany((type) => DeleteZone, (deleteZone) => deleteZone.floor, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  deleteZone: DeleteZone[];

  @OneToMany((type) => DeleteDevices, (deleteDevices) => deleteDevices.floor, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  deleteDevices: DeleteDevices[];

  @OneToMany((type) => GatewayManageAreaEntity, (gatewayManageArea) => gatewayManageArea.floor, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  gatewayManageArea: GatewayManageAreaEntity[];
}
