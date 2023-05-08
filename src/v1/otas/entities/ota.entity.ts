import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeviceType } from '../../device-types/entities/device-type.entity';

@Entity({ name: 'otas' })
export class Ota extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  version: string;

  @Column('varchar')
  note: string;

  @Column('varchar')
  fileName: string;

  @ManyToOne((type) => DeviceType, (deviceType) => deviceType.otas)
  @JoinColumn({ name: 'deviceType' })
  deviceType: DeviceType;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
