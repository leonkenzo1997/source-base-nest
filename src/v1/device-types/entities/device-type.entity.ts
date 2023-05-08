import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Ota } from '../../otas/entities/ota.entity';
import { DevicesEntity } from '../../devices/entities/device.entity';

@Entity({ name: 'device_types' })
export class DeviceType extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
  })
  type: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Ota, (otas) => otas.deviceType)
  otas: Ota[];

  @OneToMany((type) => DevicesEntity, (device) => device.deviceType)
  devices: DevicesEntity[];
}
