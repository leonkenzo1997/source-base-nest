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
import { FloorEntity } from '../../floors/entities/floor.entity';
import { protocolScene } from './../scene.const';

@Entity({ name: 'delete_scene' })
export class DeleteScene extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', nullable: false, enum: protocolScene })
  protocolSceneId: number;

  @ManyToOne((type) => FloorEntity, (floor) => floor.deleteScene, {
    cascade: ['soft-remove'],
    nullable: false,
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
}
