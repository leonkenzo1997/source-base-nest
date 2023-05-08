import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rule } from '../../rules/entities/rule.entity';

import { User } from '../../users/entities/user.entity';

@Entity({ name: 'users_rules' })
export class UserRule extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // create a new foreign key for the rule entity
  @ManyToOne(() => Rule, (rule) => rule.users, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  rule: Rule;

  // create a new foregin key for the user entity
  @ManyToOne((type) => User, (user) => user.rules, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
