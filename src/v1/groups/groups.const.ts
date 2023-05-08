export const GROUP_SELECT = {
  id: true,
  name: true,
  protocolGroupId: true,
  buttonPosition: true,
  floorId: true,
  devices: {
    id: true,
    name: true,
    address: true,
    deviceTypeId: true,
    protocolDeviceId: true,
    deviceSetting: true,
  },
  groupSetting: {
    id: true,
    tone: true,
    brightness: true,
    fadeInTime: true,
    fadeOutTime: true,
    sensorSensitivity: true,
    brightnessRetentionTime: true,
    recognizingCycleTime: true,
    color: true,
    brightnessColor: true,
    indicatorMode: true,
    perception: true,
    notPerception: true,
    luxSetting: true,
    dimmingSetting: true,
  },
};

export let GROUP_RELATION = {
  zone: true,
  devices: { deviceSetting: true },
  groupSetting: true,
};
