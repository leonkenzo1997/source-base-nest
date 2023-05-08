export enum SortTypeDevice {
  ZONE = 'zone',
  GROUP = 'group',
  BUILDING = 'building',
  FLOOR = 'floor',
  DEVICE_TYPE = 'deviceType',
}

let data: number[] = [];
for (let i: number = 1; i <= 510; i++) {
  data.push(i);
}
export let protocolDevice = data;

export const DEVICE_SELECT = {
  building: { id: true, name: true },
  floor: { id: true, name: true },
  zone: { id: true, name: true, protocolZoneId: true },
  group: { id: true, name: true, protocolGroupId: true },
  deviceType: { id: true, type: true },
  deviceSetting: {
    id: true,
    perception: true,
    notPerception: true,
    brightness: true,
    tone: true,
    fadeOutTime: true,
    fadeInTime: true,
    sensorSensitivity: true,
    recognizingCycleTime: true,
    brightnessRetentionTime: true,
    color: true,
    indicatorMode: true,
    brightnessColor: true,
  },
  gatewayManageArea: {
    id: true,
    floor: {
      id: true,
      name: true,
    },
    zone: {
      id: true,
      name: true,
    },
  },
};

export let DEVICE_RELATION = {
  building: true,
  floor: true,
  zone: true,
  group: true,
  deviceType: true,
  deviceSetting: true,
  gatewayManageArea: {
    floor: true,
    zone: true,
  },
};

export enum OPTION_SENSOR {
  SINGLE = 'single',
  DOUBLE = 'double',
}

export const LIMIT_DEVICE_GROUP = 510;

export enum TYPE_LIGHT_BULB {
  '19W' = 1,
  '29W' = 2,
  '40W' = 3,
}
