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
import { Building } from '../../buildings/entities/building.entity';
import { FloorEntity } from '../../floors/entities/floor.entity';
import { SceneSetting } from '../../scene-setting/entities/scene-setting.entity';
import { DeleteSchedule } from '../../schedule/entities/delete-schedule.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { User } from '../../users/entities/user.entity';
import { protocolScene } from '../scene.const';

@Entity({ name: 'scene' })
export class Scene extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  name: string;

  @Column({ type: 'enum', nullable: false, enum: protocolScene })
  protocolSceneId: number;

  @ManyToOne((type) => FloorEntity, (floor) => floor.scene, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  floor: FloorEntity;

  @OneToMany((type) => SceneSetting, (sceneSetting) => sceneSetting.scene, {
    cascade: ['soft-remove', 'insert'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sceneSettings: SceneSetting[];

  @OneToMany(
    (type) => DeleteSchedule,
    (deleteSchedule) => deleteSchedule.scene,
    {
      cascade: ['soft-remove', 'insert'],
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  deleteSchedule: DeleteSchedule[];

  @OneToMany((type) => Schedule, (schedule) => schedule.scene, {
    cascade: ['soft-remove', 'insert'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  schedules: Schedule[];

  @Column({ default: false })
  deleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Building, (building) => building.scene, {
    cascade: ['soft-remove'],
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  building: Building;

  // relationship with user table
  @ManyToOne((type) => User, (user) => user.scenes)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;
}
