import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { DevicesEntity } from '../../devices/entities/device.entity';
import { ErrorLog } from '../../error-log/entities/error-log.entity';
import { Scene } from '../../scene/entities/scene.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { UserBuildingFloor } from '../../users-buildings-floors/entities/user-building-floor.entity';
import { UserBuilding } from '../../users-buildings/entities/user-building.entity';
import { User } from '../../users/entities/user.entity';
import { GatewayStatus } from '../buildings.const';

@Entity({ name: 'buildings' })
export class Building extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  name: string;

  @Index({ unique: true })
  @Column('varchar')
  address: string;

  @Column({
    type: 'enum',
    enum: GatewayStatus,
    default: GatewayStatus.NOT_USING_GATEWAY,
  })
  status: number;

  @Column({ default: false })
  deleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // assign building id for user-building table
  @OneToMany((type) => UserBuilding, (userBuilding) => userBuilding.building, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  usersBuildings: UserBuilding[];

  // assign building id for user-building-floor table
  @OneToMany(
    (type) => UserBuildingFloor,
    (usersBuildingsFloors) => usersBuildingsFloors.building,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      cascade: ['insert', 'soft-remove', 'update', 'recover'],
    },
  )
  usersBuildingsFloors: UserBuildingFloor[];

  @OneToMany((type) => ErrorLog, (errorLog) => errorLog.building, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['soft-remove'],
  })
  errors: ErrorLog[];

  // relationship with user table
  @ManyToOne((type) => User, (user) => user.buildings)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  // relationship with schedule table
  @OneToMany((type) => Schedule, (schedule) => schedule.building)
  schedules: Schedule[];

  @OneToMany((type) => DevicesEntity, (device) => device.building, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['soft-remove'],
  })
  devices: DevicesEntity[];

  @OneToMany((type) => Scene, (scene) => scene.building, {
    cascade: ['soft-remove'],
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scene: Scene[];
}
