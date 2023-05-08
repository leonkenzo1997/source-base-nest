import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common';
import { Like } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { GroupsService } from '../groups/groups.service';
import { IScene } from '../scene/interfaces/scene.interface';
import { SceneService } from '../scene/scene.service';
import { UsersService } from '../users/users.service';
import { ZonesService } from '../zones/zones.service';
import { CreateSceneSettingDto } from './dto/create-scene-setting.dto';
import { GetSceneSettingDto } from './dto/get-scene-setting.dto';
import { SceneSetting } from './entities/scene-setting.entity';
import { ISceneSetting } from './interfaces/scene-setting.interface';
import { SceneSettingRepository } from './repositories/scene-setting.repository';
import {
  LIST_SCENE_SETTING_RELATION,
  LIST_SCENE_SETTING_SELECT
} from './scene-setting.const';

@Injectable()
export class SceneSettingService extends BaseService<
  SceneSetting,
  SceneSettingRepository
> {
  constructor(
    private readonly sceneSettingRepository: SceneSettingRepository,
    private paginationService: PaginationService,
    @Inject(forwardRef(() => SceneService))
    private readonly sceneService: SceneService,
    private readonly zonesService: ZonesService,
    private readonly groupsService: GroupsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    super(sceneSettingRepository);
  }

  /**
   * This function is create new scene setting
   *
   * @param sceneId number
   * @param userId number
   * @param createSceneSettingDto createSceneSettingDto
   * @returns ISceneSetting
   */
  public async createSceneSetting(
    sceneId: number,
    userId: number,
    createSceneSettingDto: CreateSceneSettingDto,
  ): Promise<ISceneSetting> {
    const scene = await this.sceneService.findById(sceneId);

    if (!scene) {
      throw new HttpException('SCENE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (scene.sceneSettings.length >= 255) {
      throw new HttpException(
        'LIMIT_SCENE_SETTING_OF_SCENE',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.usersService.findOne({
      id: userId,
      usersBuildingsFloors: { floor: { id: scene.floor.id } },
    });

    if (!user) {
      throw new BadRequestException('SCENE_FLOOR_NOT_MATCH_USER_FLOOR');
    }

    let dataCreate = await this.checkSceneSetting(createSceneSettingDto, scene);

    dataCreate['protocolSceneSettingId'] = scene.sceneSettings.length + 1;
    let result: ISceneSetting = await this.sceneSettingRepository.create(
      dataCreate,
    );

    for (let i = 0; i < result.sceneSettingArea.length; i++) {
      let zone = await this.zonesService.findById(
        result.sceneSettingArea[i].zone.id,
      );
      let group = await this.groupsService.findById(
        result.sceneSettingArea[i].group.id,
      );

      result.sceneSettingArea[i] = {
        ...result.sceneSettingArea[i],
        zone: {
          id: zone.id,
          protocolId: zone.protocolZoneId,
        },
        group: {
          id: group.id,
          protocolId: group.protocolGroupId,
        },
      };
    }

    return result;
  }

  /**
   * This function is update scene setting
   *
   * @param id number
   * @param updateSceneSettingDto createSceneSettingDto
   * @param userId number
   * @returns ISceneSetting
   */
  public async updateSceneSetting(
    id: number,
    updateSceneSettingDto: CreateSceneSettingDto,
    userId: number,
  ): Promise<ISceneSetting> {
    const sceneSetting = await this.sceneSettingRepository.findOne(
      { id: id },
      { scene: true },
    );
    if (!sceneSetting) {
      throw new HttpException('SCENE_SETTING_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const scene = await this.sceneService.findById(sceneSetting.scene.id);
    const user = await this.usersService.findOne({
      id: userId,
      usersBuildingsFloors: { floor: { id: scene.floor.id } },
    });

    if (!user) {
      throw new BadRequestException('SCENE_FLOOR_NOT_MATCH_USER_FLOOR');
    }

    let dataUpdate = await this.checkSceneSetting(updateSceneSettingDto, scene);

    dataUpdate['protocolSceneSettingId'] = sceneSetting.protocolSceneSettingId;

    await this.sceneSettingRepository.softRemove(id, {
      sceneSettingArea: true,
    });

    const result = await this.sceneSettingRepository.create(dataUpdate);

    return result;
  }

  /**
   * This function is check scene setting
   *
   * @param createSceneSettingDto createSceneSettingDto
   * @param scene IScene
   * @returns any
   */
  public async checkSceneSetting(
    createSceneSettingDto: CreateSceneSettingDto,
    scene: IScene,
  ): Promise<any> {
    // check name scene setting

    const checkName = await this.sceneSettingRepository.findOne({
      name: createSceneSettingDto.name,
      scene: { id: scene.id },
    });

    if (checkName) {
      throw new BadRequestException('NAME_SCENE_SETTING_REGISTERED');
    }

    let newArea: any[] = [];
    for (let zone of createSceneSettingDto.zone) {
      let checkZone = await this.zonesService.findById(zone.zoneId);

      if (checkZone.floor.id != scene.floor.id) {
        throw new HttpException(
          'ZONE_FLOOR_NOT_MATCH_USER_FLOOR',
          HttpStatus.BAD_REQUEST,
        );
      }
      let checkArea: any[] = [];
      for (let group of zone.group) {
        let checkGroup = await this.groupsService.findById(group.groupId);

        // check group assign zone
        if (checkGroup.zone.id != zone.zoneId) {
          throw new HttpException(
            'GROUP_NOT_MATCH_GROUP_OF_ZONE',
            HttpStatus.BAD_REQUEST,
          );
        }

        // check duplicate area scene setting
        if (!checkArea[group.groupId]) {
          checkArea[group.groupId] = group.groupId;
        } else {
          throw new HttpException(
            'AREA_SCENE_SETTING_DUPLICATE',
            HttpStatus.BAD_REQUEST,
          );
        }
        newArea.push({
          floor: { id: scene.floor.id, name: scene.floor.name },
          zone: { id: zone.zoneId },
          group: { id: group.groupId },
        });
      }
    }

    let dataCreate = {
      scene: { id: scene.id, name: scene.name },
      name: createSceneSettingDto.name,
      tone: createSceneSettingDto.tone,
      brightness: createSceneSettingDto.brightness,
      sceneSettingArea: newArea,
    };

    return dataCreate;
  }

  /**
   * This function is get list scene setting for web
   *
   * @param getSceneSettingDto GetSceneSettingDto
   * @returns IPagination
   */
  public async listSceneSettingByWeb(
    getSceneSettingDto: GetSceneSettingDto,
  ): Promise<IPagination> {
    const page = getSceneSettingDto.page ? getSceneSettingDto.page : 1;
    const limit = getSceneSettingDto.limit ? getSceneSettingDto.limit : 10;
    const sortType = getSceneSettingDto.sortType;
    const sortBy = getSceneSettingDto.sortBy ? getSceneSettingDto.sortBy : '';
    const keyword = getSceneSettingDto.keyword;
    const skip = (page - 1) * limit;
    const sceneId = getSceneSettingDto.sceneId;

    let order = {};
    let where = {};

    if (getSceneSettingDto.keyword) {
      where['name'] = Like(`%${keyword}%`);
    }

    where = {
      ...where,
      scene: { id: sceneId },
    };

    const [sceneSetting, total] =
      await this.sceneSettingRepository.findAndCount(
        where,
        LIST_SCENE_SETTING_RELATION,
        LIST_SCENE_SETTING_SELECT,
        limit,
        skip,
        order,
      );

    let newSceneSetting = await this.handleSceneSettingArea(sceneSetting);

    const result = await this.paginationService.pagination(
      newSceneSetting,
      total,
      page,
      limit,
    );

    return result;
  }

  /**
   * This function handle scene setting area in scene setting
   *
   * @param sceneSetting ISceneSetting[]
   * @returns ISceneSetting[]
   */
  private async handleSceneSettingArea(
    sceneSetting: ISceneSetting[],
  ): Promise<ISceneSetting[]> {
    for (let setting of sceneSetting) {
      let zoneArray: any = [];
      let newZoneArray: any = [];

      for (let area of setting.sceneSettingArea) {
        if (area.zone) {
          if (!newZoneArray[area.zone.id]) {
            newZoneArray[area.zone.id] = area.zone.id;
            zoneArray.push({
              id: area.zone.id,
              name: area.zone.name,
              group: [area.group],
            });
          } else {
            // handle group of zones
            zoneArray.map((zone: any) => {
              if (zone.id === area.zone.id) {
                zone.group.push(area.group);
                return;
              }
            });
          }
        }
      }

      delete setting.sceneSettingArea;
      setting['zone'] = zoneArray;
    }

    return sceneSetting;
  }
}
