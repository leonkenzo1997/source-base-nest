import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Scene } from '../../scene/entities/scene.entity';
import { protocolSchedule } from '../schedule.const';
import { FloorEntity } from '../../floors/entities/floor.entity';

@Entity({ name: 'delete_schedule' })
export class DeleteSchedule extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', nullable: false, enum: protocolSchedule })
  protocolScheduleId: number;

  @ManyToOne((type) => FloorEntity, (floor) => floor.deleteSchedule, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  floor: FloorEntity;

  @ManyToOne((type) => Scene, (scene) => scene.deleteSchedule, {
    cascade: ['soft-remove', 'insert'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scene: Scene;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
