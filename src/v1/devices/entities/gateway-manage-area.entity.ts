import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { FloorEntity } from '../../floors/entities/floor.entity';
import { ZoneEntity } from '../../zones/entities/zone.entity';
import { DevicesEntity } from './device.entity';

@Entity({ name: 'gateway-manage-area' })
export class GatewayManageAreaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne((type) => DevicesEntity, (device) => device.gatewayManageArea, {
    cascade: ['soft-remove', 'insert'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'deviceId' })
  device: DevicesEntity;

  @Column({ nullable: true })
  deviceId: number;

  @ManyToOne((type) => FloorEntity, (floor) => floor.gatewayManageArea)
  @JoinColumn({ name: 'floorId' })
  floor: FloorEntity;

  @Column({ nullable: true })
  floorId: number;

  @ManyToOne((type) => ZoneEntity, (zone) => zone.gatewayManageArea)
  @JoinColumn({ name: 'zoneId' })
  zone: ZoneEntity;

  @Column({ nullable: true })
  zoneId: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
