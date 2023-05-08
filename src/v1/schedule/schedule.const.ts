export enum ScheduleType {
  DAILY = 1,
  DAY_OF_WEEK = 2,
  SPECIFIC_DATE = 3,
}

let data: number[] = [];
for (let i = 1; i <= 30; i++) {
  data.push(i);
}
export let protocolSchedule = data;

export const SCHEDULE_SELECT = {
  scene: {
    id: true,
    name: true,
    protocolSceneId: true,
  },
  floor: {
    id: true,
    name: true,
  },
  createdBy: {
    id: true,
    email: true,
    fullName: true,
  },
  building: {
    id: true,
    name: true,
  },
};

export let SCHEDULE_RELATION = {
  scene: true,
  floor: true,
  createdBy: true,
  building: true,
};

export let ORDER_BY_SCHEDULE = {
  FLOOR: 'floor',
  BUILDING: 'building',
  SCENE: 'scene'
}
