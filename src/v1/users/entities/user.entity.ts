import { UserRule } from '../../users-rules/entities/user-rule.entity';
/* eslint-disable prettier/prettier */
import { Exclude, instanceToPlain } from 'class-transformer';
import { Max, Min } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Session } from '../../sessions/entities/session.entity';
import { UserGender, UserStatus } from '../user.const';

@Entity({ name: 'users' })
// @Unique(['email', 'phoneNumber'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Min(1)
  @Max(4)
  @Column({ type: 'tinyint', default: UserStatus.Active })
  status: UserStatus;

  @Column({
    type: 'varchar',
    length: 320,
  })
  email!: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  //@Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  userName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: 65, nullable: true })
  phoneNumber?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'enum', enum: UserGender })
  gender: UserGender;

  @Column({ type: 'varchar', length: 320, nullable: true })
  emailContact: string;

  @OneToMany(() => Session, (session) => session.user, {
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sessions: Session[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  // //using many to many method
  // @ManyToMany(() => Rule, (rule) => rule.users, {
  //   cascade: ['insert', 'soft-remove', 'update', 'recover'],
  //   onDelete: 'CASCADE',
  // })
  // @JoinTable({ name: 'users_rules' , })
  // rules: Rule[];

  // asssign rule id for users-rules table
  @OneToMany((type) => UserRule, (userRule) => userRule.user, {
    nullable: false,
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rules: UserRule[];

  @Column({ default: false })
  isSaved: boolean;

  @Column({ nullable: true })
  loginAccessTime: Date;

  @Column({ nullable: true })
  lastActiveTime: Date;

  toJSON() {
    const result = instanceToPlain(this);
    delete result.password;

    return result;
  }
}
