import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'information_company' })
export class InformationCompany extends BaseEntity{
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { nullable: false })
  info: string;

  @Column('varchar', { nullable: false })
  address: string;

  @Column('varchar', { nullable: false, unique: true })
  tel: string;

  @Column('varchar', { nullable: false })
  copyright: string;

}
