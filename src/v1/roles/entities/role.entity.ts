/* eslint-disable prettier/prettier */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { RoleName } from '../roles.const';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: RoleName })
  name: RoleName;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  // @ManyToOne(() => Rule, (rule) => rule.role)
  // rules: Rule[];

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
