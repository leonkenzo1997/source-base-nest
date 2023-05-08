import { GROUP_SELECT } from '../groups/groups.const';

let data: number[] = [];
for (let i: number = 1; i <= 255; i++) {
  data.push(i);
}
export let protocolZone = data;

export const ZONE_SELECT = {
  id: true,
  name: true,
  buildingId: true,
  protocolZoneId: true,
  groups: GROUP_SELECT,
  devices: {
    id: true,
    name: true,
    address: true,
    deviceTypeId: true,
    protocolDeviceId: true,
  },
};

export let ZONE_RELATION = {
  floor: { usersBuildingsFloors: { user: true } },
  groups: { devices: true },
  devices: true,
};

export const LIST_ZONE_SELECT = {
  id: true,
  name: true,
  buildingId: true,
  protocolZoneId: true,
  groups: GROUP_SELECT,
  devices: {
    id: true,
    name: true,
    address: true,
    deviceTypeId: true,
    protocolDeviceId: true,
  },
  gatewayManageArea: true,
};

export let LIST_ZONE_RELATION = {
  devices: true,
  gatewayManageArea: true,
};
