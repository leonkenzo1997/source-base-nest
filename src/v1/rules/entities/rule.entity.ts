import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserRule } from '../../users-rules/entities/user-rule.entity';

@Entity({ name: 'rules' })
export class Rule extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
  })
  name!: string;

  // using many to many method
  // @ManyToMany(() => User, (user) => user.rules)
  // public users: User[];

  // asssign build id for user-building table
  @OneToMany((type) => UserRule, (UserRule) => UserRule.rule, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: UserRule[];

  // @ManyToOne(() => Role, role => role.rules)
  // public role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
