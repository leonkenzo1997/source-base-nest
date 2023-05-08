import { FloorEntity } from '../../floors/entities/floor.entity';
import { Group } from '../../groups/entities/group.entity';
import { ZoneEntity } from '../../zones/entities/zone.entity';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SceneSetting } from '../../scene-setting/entities/scene-setting.entity';

@Entity({ name: 'scene_setting_area' })
export class SceneSettingArea extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(
    (type) => SceneSetting,
    (sceneSetting) => sceneSetting.sceneSettingArea,
    {
      cascade: ['soft-remove', 'insert'],
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  sceneSetting: SceneSetting;

  @ManyToOne((type) => FloorEntity, (floor) => floor.sceneSettingArea, {
    cascade: ['soft-remove', 'insert'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  floor: FloorEntity;

  @ManyToOne((type) => ZoneEntity, (zone) => zone.sceneSettingArea, {
    cascade: ['soft-remove', 'insert'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  zone: ZoneEntity;

  @ManyToOne((type) => Group, (group) => group.sceneSettingArea, {
    cascade: ['soft-remove', 'insert'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  group: Group;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
