import { ZONE_SELECT } from '../zones/zones.const';

export const FLOOR_SELECT = {
  usersBuildingsFloors: {
    id: true,
    building: { id: true, name: true, address: true },
    user: { id: true, email: true },
  },
  zones: ZONE_SELECT,
  createdBy: { id: true, email: true },
  scene: { id: true, name: true },
  schedules: { id: true, name: true },
  devices: {
    id: true,
    name: true,
    address: true,
    deviceTypeId: true,
    protocolDeviceId: true,
  },
};

export let FLOOR_RELATION = {
  usersBuildingsFloors: { building: true, user: true },
  // zones: { groups: { devices: true }, devices: true },
  zones: { groups: { devices: true } },
  createdBy: true,
  scene: true,
  schedules: true,
  devices: true,
};
