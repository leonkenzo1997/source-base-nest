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
import { protocolZone } from '../zones.const';
import { FloorEntity } from '../../floors/entities/floor.entity';

@Entity({ name: 'delete_zone' })
export class DeleteZone extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', nullable: false, enum: protocolZone })
  protocolZoneId: number;

  @ManyToOne((type) => FloorEntity, (floor) => floor.deleteZone, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'floorId' })
  floor: FloorEntity;

  @Column({ nullable: false })
  floorId: number;

  @Column({ nullable: false })
  buildingId: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
