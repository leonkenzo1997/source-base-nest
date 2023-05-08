import { Max, Min } from 'class-validator';
import {
  BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

export enum SessionStatus {
  Active = 1,
  Deactivated = 2,
}

@Entity({ name: 'sessions' })
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Min(1)
  @Max(2)
  @Column({ type: 'tinyint', default: SessionStatus.Active })
  status: SessionStatus;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user, {
    cascade: ['insert', 'soft-remove', 'update', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  user: User;
}
