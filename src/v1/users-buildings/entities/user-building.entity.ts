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

@Entity({ name: 'users_buildings' })
export class UserBuilding extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // create a new foreign key for the building entity
  @ManyToOne(() => Building, (building) => building.usersBuildings, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  building: Building;

  // create a new foregin key for the user entity
  @ManyToOne((type) => User, (user) => user.usersBuildings, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
