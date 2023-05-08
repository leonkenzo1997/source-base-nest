import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { DevicesEntity } from '../../devices/entities/device.entity';
import {
  DIMMING_MODE,
  INDICATOR_LIGHT_MODE,
  SENSITIVITY_OPTION
} from '../device-setting.const';

@Entity({ name: 'device_setting' })
export class DeviceSetting extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'double', nullable: true })
  brightness: number;

  @Column({ type: 'double', nullable: true })
  tone: number;

  @Column({ type: 'double', nullable: true })
  fadeInTime: number;

  @Column({ type: 'double', nullable: true })
  fadeOutTime: number;

  @Column({ type: 'enum', nullable: true, enum: SENSITIVITY_OPTION })
  sensorSensitivity: number;

  @Column({ type: 'double', nullable: true })
  brightnessRetentionTime: number;

  @Column({ type: 'double', nullable: true })
  recognizingCycleTime: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne((type) => DevicesEntity, (device) => device.deviceSetting, {
    cascade: ['soft-remove', 'insert'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  device: DevicesEntity;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
  })
  color: string;

  @Column({ type: 'double', nullable: true })
  brightnessColor: number;

  @Column({ type: 'enum', nullable: true, enum: INDICATOR_LIGHT_MODE })
  indicatorMode: number;

  @Column({ type: 'int', nullable: true })
  perception: number;

  @Column({ type: 'int', nullable: true })
  notPerception: number;

  @Column({ type: 'int', nullable: true })
  luxSetting: number;

  @Column({ type: 'enum', enum: DIMMING_MODE, nullable: true })
  dimmingSetting: number;
}
