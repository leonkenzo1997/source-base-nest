import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SceneSettingArea } from '../../scene-setting-area/entities/scene-setting-area.entity';
import { Scene } from '../../scene/entities/scene.entity';
import { protocolSceneSetting } from '../scene-setting.const';

@Entity({ name: 'scene_setting' })
export class SceneSetting extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  name: string;

  @Column('int')
  brightness: number;

  @Column('int')
  tone: number;

  @Column('boolean', { default: false })
  status: boolean;

  @Column({ type: 'enum', nullable: false, enum: protocolSceneSetting })
  protocolSceneSettingId: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Scene, (scene) => scene.sceneSettings, {
    cascade: ['soft-remove', 'insert'],
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scene: Scene;

  @OneToMany(
    (type) => SceneSettingArea,
    (sceneSettingArea) => sceneSettingArea.sceneSetting,
    {
      cascade: ['soft-remove', 'insert'],
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  sceneSettingArea: SceneSettingArea[];
}
