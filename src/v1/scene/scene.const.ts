let data: number[] = [];
for (let i: number = 1; i <= 30; i++) {
  data.push(i);
}
export let protocolScene = data;

export const SCENE_SELECT = {
  id: true,
  name: true,
  protocolSceneId: true,
  floor: {
    id: true,
    name: true,
  },
  sceneSettings: {
    id: true,
    name: true,
    brightness: true,
    tone: true,
    status: true,
    sceneSettingArea: {
      id: true,
      zone: { id: true, name: true, protocolZoneId: true },
      group: { id: true, name: true, protocolGroupId: true },
    },
  },
};

export let SCENE_RELATION = {
  sceneSettings: { sceneSettingArea: { zone: true, group: true } },
  floor: { usersBuildingsFloors: { user: true } },
  schedules: true,
};

export const SCENE_SELECT_WEB = {
  id: true,
  name: true,
  protocolSceneId: true,
  createdBy: { email: true, userName: true },
  floor: {
    id: true,
    name: true,
  },
  sceneSettings: {
    id: true,
    name: true,
    brightness: true,
    tone: true,
    status: true,
    sceneSettingArea: {
      id: true,
      zone: { id: true, name: true, protocolZoneId: true },
      group: { id: true, name: true, protocolGroupId: true },
    },
  },
  building: { id: true, name: true },
};

export let SCENE_RELATION_WEB = {
  sceneSettings: { sceneSettingArea: { zone: true, group: true } },
  floor: { usersBuildingsFloors: { user: true } },
  schedules: true,
  createdBy: true,
  building: true,
};

export let ORDER_BY_SCENE = {
  BUILDING: 'building',
  // NAME: 'NAME',
  // PROTOCOL: 'protocolSceneId',
  FLOOR: 'floor',
};
