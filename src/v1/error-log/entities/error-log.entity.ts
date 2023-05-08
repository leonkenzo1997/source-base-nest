import { Building } from '../../buildings/entities/building.entity';
import { User } from '../../users/entities/user.entity';
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

@Entity({ name: 'error_log' })
export class ErrorLog extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { nullable: false })
  errorId: string;

  @Column('varchar', { nullable: false })
  type: string;

  @Column('varchar', { nullable: false })
  reporter: string;

  @ManyToOne((type) => Building, (building) => building.errors, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  building: Building;
  
  @ManyToOne((type) => User, (user) => user.errors, {
    cascade: ['soft-remove'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column('varchar', { nullable: false })
  buildingName: string;

  @Column('varchar', { nullable: false })
  userRole: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
