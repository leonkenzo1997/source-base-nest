export enum GatewayStatus {
  USING_GATEWAY = 2,
  NOT_USING_GATEWAY = 1,
}

export const BUILDING_SELECT = {
  usersBuildings: {
    id: true,
    user: { id: true, email: true, role: { id: true, name: true } },
  },
  usersBuildingsFloors: { id: true, floor: { id: true, name: true } },
};
export let BUILDING_RELATION = {
  usersBuildings: { user: { role: true } },
  usersBuildingsFloors: { floor: true },
};
