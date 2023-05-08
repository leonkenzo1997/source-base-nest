import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common';
import { Like, MoreThanOrEqual } from 'typeorm';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { IJwt } from '../authentication/interfaces/jwt.interface';
import { DeviceType } from '../device-types/device-types.const';
import { DevicesService } from '../devices/devices.service';
import { FloorsService } from '../floors/floors.service';
import { GroupsService } from '../groups/groups.service';
import { CreateSceneSettingDto } from '../scene-setting/dto/create-scene-setting.dto';
import { UpdateSceneSettingDto } from '../scene-setting/dto/update-scene-setting.dto';
import { SceneSetting } from '../scene-setting/entities/scene-setting.entity';
import { ISceneSetting } from '../scene-setting/interfaces/scene-setting.interface';
import { SceneSettingService } from '../scene-setting/scene-setting.service';
import { UserRole } from '../users/user.const';
import { UsersService } from '../users/users.service';
import { ZonesService } from '../zones/zones.service';
import { CreateSceneDto } from './dto/create-scene.dto';
import { GetListSceneByBuildingDto, GetScenesDto } from './dto/get-scenes.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { Scene } from './entities/scene.entity';
import { IScene } from './interfaces/scene.interface';
import { DeleteScenesRepository } from './repositories/delete-scene.repository';
import { ScenesRepository } from './repositories/scenes.repository';
import {
  ORDER_BY_SCENE,
  SCENE_RELATION,
  SCENE_RELATION_WEB,
  SCENE_SELECT,
  SCENE_SELECT_WEB
} from './scene.const';

@Injectable()
export class SceneService {
  constructor(
    private readonly scenesRepository: ScenesRepository,
    private readonly deleteScenesRepository: DeleteScenesRepository,
    private paginationService: PaginationService,
    private readonly floorsService: FloorsService,
    private readonly zonesService: ZonesService,
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => SceneSettingService))
    private readonly sceneSettingService: SceneSettingService,
    private readonly devicesService: DevicesService,
  ) {}

  /**
   * This method create new scene
   *
   * @param userId number
   * @param createSceneDto CreateSceneDto
   * @returns IScene
   */
  public async createScene(
    userId: number,
    createSceneDto: CreateSceneDto,
  ): Promise<IScene> {
    const floor = await this.floorsService.getDetailFloors(
      createSceneDto.floorId,
    );

    let checkFloor = floor.users.some((item: any) => item.id === userId);

    // check floor with list floor of user
    if (!checkFloor) {
      throw new HttpException(
        'FLOOR_NOT_MATCH_USER_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }
    //check the quantity of scenes in floor

    if (floor.scene.length >= 30) {
      throw new HttpException('LIMIT_SCENE_OF_FLOOR', HttpStatus.FORBIDDEN);
    }

    // check name scenes
    let checkName = await this.checkName(
      createSceneDto.name,
      createSceneDto.floorId,
    );

    let newSettings = await this.checkSceneSetting(
      createSceneDto.sceneSettings,
      floor.id,
    );

    // find and check scene deleted
    const deleteScene = await this.deleteScenesRepository.findOne(
      {
        floor: { id: floor.id },
      },
      null,
      null,
      { protocolSceneId: 'ASC' },
    );

    // create scene
    let result: IScene;
    let dataCreate: any = {
      ...createSceneDto,
      floor: { id: createSceneDto.floorId },
      createdBy: { id: userId },
      building: { id: floor.building.id },
      sceneSettings: newSettings,
    };

    if (deleteScene) {
      dataCreate = {
        ...dataCreate,
        protocolSceneId: deleteScene.protocolSceneId,
      };

      result = await this.scenesRepository.create(dataCreate);

      await this.deleteScenesRepository.softRemove(deleteScene.id);
    } else {
      dataCreate = {
        ...dataCreate,
        protocolSceneId: floor.scene.length + 1,
      };

      result = await this.scenesRepository.create(dataCreate);
    }

    result = await this.handleSceneSettingArea(result);

    return result;
  }

  /**
   * This method get detail scene
   *
   * @param user IJwt
   * @param sceneId number
   * @returns IScene
   */
  public async detailScene(user: IJwt, sceneId: number): Promise<IScene> {
    const scene = await this.findById(sceneId, user);

    if (user.roleId === UserRole.User) {
      let checkFloor = await this.checkSceneAssign(user.userId, scene);
    }

    return await this.handleScene(scene);
  }

  /**
   * This Method is handle scene
   *
   * @param data IScene
   * @returns IScene
   */
  private async handleScene(data: IScene): Promise<IScene> {
    // delete array user building floor
    delete data.floor.usersBuildingsFloors;

    // handle array zones of scene area
    data.sceneSettings.map((setting: any) => {
      let zoneArray: any = [];
      let newZoneArray: any = [];

      setting.sceneSettingArea.map((area: any) => {
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
      });

      delete setting.sceneSettingArea;
      setting['zone'] = zoneArray;
    });

    return data;
  }

  /**
   * this method get list scene from floor
   *
   * @param floorId number
   * @param user IJwt
   * @param getScenesDto GetScenesDto
   * @returnsIPagination
   */
  public async getListScene(
    floorId: number,
    user: IJwt,
    getScenesDto: GetScenesDto,
  ): Promise<IPagination> {
    const floor = await this.floorsService.getDetailFloors(floorId);

    if (!floor) {
      throw new HttpException('FLOOR_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    // check floor assign user login (user and admin account)

    let checkFloor = floor.users.some((item: any) => item.id === user.userId);

    if (!checkFloor) {
      throw new HttpException(
        'SCENE_FLOOR_NOT_MATCH_USER_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    const page = getScenesDto.page ? getScenesDto.page : 1;
    const limit = getScenesDto.limit ? getScenesDto.limit : 10;
    const sortType = getScenesDto.sortType;
    const sortBy = getScenesDto.sortBy ? getScenesDto.sortBy : '';
    const keyword = getScenesDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getScenesDto.keyword) {
      where['name'] = Like(`%${keyword}%`);
    }

    if (sortBy) {
      order = {
        [sortBy]: sortType,
      };
    } else {
      order = {
        id: sortType,
      };
    }

    where = {
      ...where,
      floor: { id: floorId },
    };

    const [scenes, total] = await this.scenesRepository.findAndCount(
      where,
      null,
      null,
      limit,
      skip,
      order,
    );

    const result = await this.paginationService.pagination(
      scenes,
      total,
      page,
      limit,
    );

    return result;
  }

  /**
   * This function is find scene by id scene
   *
   * @param id number
   * @param user
   * @returns Scene IJwt
   */
  public async findById(id: number, user?: IJwt): Promise<Scene> {
    let scene: Scene;

    if (!user || user.roleId === UserRole.User) {
      scene = await this.scenesRepository.findOne(
        { id: id },
        SCENE_RELATION,
        SCENE_SELECT,
      );
    } else {
      scene = await this.scenesRepository.findOne(
        { id: id },
        SCENE_RELATION_WEB,
        SCENE_SELECT_WEB,
      );
    }

    // check found scene
    if (!scene) {
      throw new HttpException('SCENE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return scene;
  }

  /**
   * This function is check found name scene in floor
   *
   * @param name string
   * @param floorId number
   * @returns void
   */
  public async checkName(name: string, floorId: number): Promise<void> {
    const checkName = await this.scenesRepository.findOne({
      name: name,
      floor: { id: floorId },
    });

    if (checkName) {
      throw new HttpException('NAME_SCENE_REGISTERED', HttpStatus.FOUND);
    }
  }

  /**
   * This function is check scene assign user
   *
   * @param userId number
   * @param scene IScene
   * @returns void
   */
  public async checkSceneAssign(userId: number, scene: IScene): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new HttpException('ACCOUNT_NOT_REGISTERED', HttpStatus.NOT_FOUND);
    }

    let checkFloor = user.floors.some(
      (floor: any) => floor.id === scene.floor.id,
    );

    if (!checkFloor) {
      throw new HttpException(
        'SCENE_FLOOR_NOT_MATCH_USER_FLOOR',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * This method update name of the scene
   *
   * @param id number
   * @param updateSceneDto UpdateSceneDto
   * @param userId number
   * @returns oid
   */
  public async renameScene(
    id: number,
    updateSceneDto: UpdateSceneDto,
    userId: number,
  ): Promise<IScene> {
    const scene = await this.findById(id);

    const newScene = await this.handleScene(scene);
    // check scene assign user
    let checkFloor = await this.checkSceneAssign(userId, newScene);

    // check name scene update register
    const checkName = await this.checkName(
      updateSceneDto.name,
      newScene.floor.id,
    );

    let result: IScene = await this.scenesRepository.updateOneAndReturnById(
      id,
      updateSceneDto,
    );

    result = await this.handleSceneSettingArea(result);

    return result;
  }

  /**
   * This method delete a scene
   *
   * @param id number
   * @param userId number
   * @returns void
   */
  public async deleteScene(id: number, userId: number): Promise<void> {
    const scene = await this.findById(id);

    //check schedule
    if (scene.schedules.length > 0) {
      throw new HttpException('SCENE_ASSIGN_SCHEDULE', HttpStatus.FORBIDDEN);
    }

    // check scene assign user
    let checkFloor = await this.checkSceneAssign(userId, scene);

    //create data delete_scene
    await this.deleteScenesRepository.create({
      protocolSceneId: scene.protocolSceneId,
      floor: { id: scene.floor.id },
    });

    const result = await this.scenesRepository.softRemove(id, {
      sceneSettings: { sceneSettingArea: true },
      schedules: true,
      deleteSchedule: true,
    });

    return result;
  }

  /**
   * This function is update scene setting of scene
   *
   * @param id number
   * @param updateSceneSettingDto updateSceneSettingDto[]
   * @param userId number
   * @returns IScene
   */
  public async updateSceneSetting(
    id: number,
    updateSceneSettingDto: UpdateSceneSettingDto[],
    userId: number,
  ): Promise<IScene> {
    let scene: IScene = await this.findById(id);

    if (
      !updateSceneSettingDto ||
      updateSceneSettingDto.length <= 0 ||
      updateSceneSettingDto.length > 255
    ) {
      throw new BadRequestException('INVALID_DATA');
    }

    let checkFloor = await this.checkSceneAssign(userId, scene);

    let dataCheck: any[] = [];

    updateSceneSettingDto.map((item: any) => {
      dataCheck.push({
        name: item.name,
        brightness: item.brightness,
        tone: item.tone,
        status: item.status,
        zone: item.zone,
      });
    });

    let newSettings = await this.checkSceneSetting(dataCheck, scene.floor.id);

    for (let setting of scene.sceneSettings) {
      await this.sceneSettingService.softRemove(setting.id, {
        sceneSettingArea: true,
      });
    }

    let sceneSetting: ISceneSetting[] = [];

    for (let setting of newSettings) {
      let newSetting = {
        ...setting,
        scene: {
          id: scene.id,
        },
      };

      let dataCreate = await this.sceneSettingService.create(newSetting);
      sceneSetting.push(dataCreate);
    }

    delete scene.sceneSettings;

    delete scene.floor.usersBuildingsFloors;

    scene.sceneSettings = sceneSetting;

    scene = await this.handleSceneSettingArea(scene);

    return scene;
  }

  /**
   * This function check scene setting
   *
   * @param sceneSettings CreateSceneSettingDto[]
   * @param floorId number
   * @returns SceneSetting[]
   */
  private async checkSceneSetting(
    sceneSettings: CreateSceneSettingDto[],
    floorId: number,
  ): Promise<SceneSetting[]> {
    let newSettings: any[] = [];
    let checkNameSettings: any[] = [];

    let checkGroupArea: any[] = [];
    let i = 1;
    for (let setting of sceneSettings) {
      let checkZoneArea: any[] = [];
      let newArea: any[] = [];

      // check duplicate name setting input
      if (!checkNameSettings[setting.name]) {
        checkNameSettings[setting.name] = setting.name;
      } else {
        throw new HttpException('SCENE_DUPLICATE', HttpStatus.BAD_REQUEST);
      }

      for (let zone of setting.zone) {
        let checkZone = await this.zonesService.findById(zone.zoneId);
        // check duplicate zone
        if (!checkZoneArea[zone.zoneId]) {
          checkZoneArea[zone.zoneId] = zone.zoneId;
        } else {
          throw new HttpException(
            'AREA_SCENE_SETTING_DUPLICATE',
            HttpStatus.BAD_REQUEST,
          );
        }

        //check zone registered
        if (!checkZone) {
          throw new HttpException('ZONE_NOT_FOUND', HttpStatus.BAD_REQUEST);
        }

        // check zone assign floor
        if (checkZone.floor.id != floorId) {
          throw new HttpException(
            'ZONE_NOT_MATCH_ZONE_OF_FLOOR',
            HttpStatus.BAD_REQUEST,
          );
        }

        for (let group of zone.group) {
          let checkGroup = await this.groupsService.findById(group.groupId);

          if (!checkGroup) {
            throw new HttpException('GROUP_NOT_FOUND', HttpStatus.NOT_FOUND);
          }

          // check group assign zone
          if (checkGroup.zone.id != zone.zoneId) {
            throw new HttpException(
              'GROUP_NOT_MATCH_GROUP_OF_ZONE',
              HttpStatus.BAD_REQUEST,
            );
          }

          // check duplicate area scene setting
          if (!checkGroupArea[group.groupId]) {
            checkGroupArea[group.groupId] = group.groupId;
          } else {
            throw new HttpException(
              'AREA_SCENE_SETTING_DUPLICATE',
              HttpStatus.BAD_REQUEST,
            );
          }

          newArea.push({
            floor: { id: floorId },
            zone: { id: zone.zoneId },
            group: { id: group.groupId },
          });
        }
      }

      newSettings.push({
        name: setting.name,
        status: setting.status,
        brightness: setting.brightness,
        tone: setting.tone,
        sceneSettingArea: newArea,
        protocolSceneSettingId: i,
      });

      i = i + 1;
    }

    return newSettings;
  }

  /**
   * This function is get list scene by building
   *
   * @param getListSceneByBuildingDto GetListSceneByBuildingDto
   * @returns IPagination
   */
  public async getListSceneByBuilding(
    getListSceneByBuildingDto: GetListSceneByBuildingDto,
  ): Promise<IPagination> {
    const page = getListSceneByBuildingDto.page
      ? getListSceneByBuildingDto.page
      : 1;
    const limit = getListSceneByBuildingDto.limit
      ? getListSceneByBuildingDto.limit
      : 10;
    const sortType = getListSceneByBuildingDto.sortType;
    const sortBy = getListSceneByBuildingDto.sortBy
      ? getListSceneByBuildingDto.sortBy
      : '';
    const keyword = getListSceneByBuildingDto.keyword;

    const skip = (page - 1) * limit;
    let order = {};
    let where = {};
    let select = {};

    let relations = {};

    if (getListSceneByBuildingDto.keyword) {
      where['name'] = Like(`%${keyword}%`);
    }

    if (sortBy) {
      switch (sortBy) {
        case ORDER_BY_SCENE.BUILDING:
        case ORDER_BY_SCENE.FLOOR:
          order = {
            [sortBy]: { name: sortType },
          };
          break;
        default:
          order = {
            [sortBy]: sortType,
          };
          break;
      }
    } else {
      order = {
        id: sortType,
      };
    }

    if (getListSceneByBuildingDto.floor) {
      const floor = await this.floorsService.findOne({
        id: getListSceneByBuildingDto.floor,
        usersBuildingsFloors: {
          building: { id: getListSceneByBuildingDto.building },
        },
      });

      if (!floor) {
        throw new BadRequestException('FLOOR_NOT_EXIST_IN_BUILDING');
      }

      where = {
        ...where,
        floor: { id: getListSceneByBuildingDto.floor },
      };
    } else {
      where = {
        ...where,
        building: { id: getListSceneByBuildingDto.building },
      };
    }

    if (getListSceneByBuildingDto.scheduleApplied) {
      if (getListSceneByBuildingDto.scheduleApplied === true) {
        where = {
          ...where,
          schedules: { id: MoreThanOrEqual(0) },
        };
      }
    }

    relations = {
      ...relations,
      floor: true,
      building: true,
    };

    select = {
      ...select,
      id: true,
      name: true,
      protocolSceneId: true,
      floor: {
        name: true,
      },
      building: {
        name: true,
      },
    };

    const [scenes, total] = await this.scenesRepository.findAndCount(
      where,
      relations,
      select,
      limit,
      skip,
      order,
    );
    const result = await this.paginationService.pagination(
      scenes,
      total,
      page,
      limit,
    );

    return result;
  }

  public async detailSceneForWeb(sceneId: number) {
    const scene = await this.findById(sceneId);

    let newScene = await this.handleScene(scene);
  }

  /**
   * this method get list scene by device
   *
   * @param deviceId number
   * @param user IJwt
   * @param getScenesDto GetScenesDto
   * @returnsIPagination
   */
  public async getSceneByDevice(
    deviceId: number,
    getScenesDto: GetScenesDto,
  ): Promise<IPagination> {
    const device = await this.devicesService.findById(deviceId);

    // check device registration
    if (!device) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check device type are lighting or smart sensor
    if (
      device.deviceType.id != DeviceType.LightBulb &&
      device.deviceType.id != DeviceType.SmartSensor
    ) {
      throw new HttpException(
        'DEVICE_MUST_LIGHT_BULB_OR_SMART_SENSOR',
        HttpStatus.FORBIDDEN,
      );
    }

    let select = {
      id: true,
      name: true,
      protocolSceneId: true,
    };

    const page = getScenesDto.page ? getScenesDto.page : 1;
    const limit = getScenesDto.limit ? getScenesDto.limit : 10;
    const sortType = getScenesDto.sortType;
    const sortBy = getScenesDto.sortBy ? getScenesDto.sortBy : '';
    const keyword = getScenesDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getScenesDto.keyword) {
      where['name'] = Like(`%${keyword}%`);
    }

    if (sortBy) {
      order = {
        [sortBy]: sortType,
      };
    } else {
      order = {
        id: sortType,
      };
    }

    where = {
      ...where,
      floor: { id: device.floor.id },
    };

    const [scenes, total] = await this.scenesRepository.findAndCount(
      where,
      null,
      select,
      limit,
      skip,
      order,
    );

    const result = await this.paginationService.pagination(
      scenes,
      total,
      page,
      limit,
    );

    return result;
  }

  public async handleSceneSettingArea(data: IScene) {
    for (let sceneSetting of data.sceneSettings) {
      for (let i = 0; i < sceneSetting.sceneSettingArea.length; i++) {
        let zone = await this.zonesService.findById(
          sceneSetting.sceneSettingArea[i].zone.id,
        );
        let group = await this.groupsService.findById(
          sceneSetting.sceneSettingArea[i].group.id,
        );

        sceneSetting.sceneSettingArea[i] = {
          ...sceneSetting.sceneSettingArea[i],
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
    }

    return data;
  }
}
