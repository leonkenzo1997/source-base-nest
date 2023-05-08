
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn,
  ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { FloorEntity } from '../../floors/entities/floor.entity';
import { Scene } from '../../scene/entities/scene.entity';
import { protocolSchedule, ScheduleType } from '../schedule.const';
import { User } from "../../users/entities/user.entity";
import { Building } from "../../buildings/entities/building.entity";

@Entity({ name: 'schedule' })
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column({ type: 'enum', enum: ScheduleType, nullable: false })
  type: ScheduleType;

  @Column({ type: 'int', nullable: false })
  hours: number;

  @Column({ type: 'int', nullable: false })
  minutes: number;

  @Column({ type: 'int', nullable: true })
  dayOfWeek: number;

  @Column({ type: 'int', nullable: true })
  months: number;

  @Column({ type: 'int', nullable: true })
  date: number;

  @Column({ type: 'int', nullable: true })
  years: number;

  @Column({ type: 'enum', nullable: false, enum: protocolSchedule })
  protocolScheduleId: number;

  @ManyToOne((type) => Scene, (scene) => scene.schedules, {
    cascade: ['soft-remove', 'insert'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scene: Scene;

  @ManyToOne((type) => FloorEntity, (floor) => floor.schedules, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  floor: FloorEntity;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relationship with user table
  @ManyToOne((type) => User, (user) => user.schedules)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  // relationship with building table
  @ManyToOne((type) => Building, (building) => building.schedules)
  @JoinColumn({ name: 'buildingId' })
  building: Building;

  @Column({ nullable: true })
  buildingId: number;
}
