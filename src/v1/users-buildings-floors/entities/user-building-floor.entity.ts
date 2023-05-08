import { FloorEntity } from '../../floors/entities/floor.entity';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Building } from '../../buildings/entities/building.entity';

import { User } from '../../users/entities/user.entity';

@Entity({ name: 'users_buildings_floors' })
export class UserBuildingFloor extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // create a new foreign key for the building entity
  @ManyToOne(() => User, (user) => user.usersBuildingsFloors, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  // create a new foreign key for the building entity
  @ManyToOne(() => Building, (building) => building.usersBuildingsFloors, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  building: Building;

  // create a new foregin key for the floor entity
  @ManyToOne((type) => FloorEntity, (floor) => floor.usersBuildingsFloors, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  floor: FloorEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
