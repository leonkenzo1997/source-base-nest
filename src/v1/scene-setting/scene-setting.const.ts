let data: number[] = [];
for (let i = 1; i <= 255; i++) {
  data.push(i);
}
export let protocolSceneSetting = data;

export const LIST_SCENE_SETTING_SELECT = {
  id: true,
  name: true,
  brightness: true,
  tone: true,
  status: true,
  sceneSettingArea: {
    id: true,
    zone: { id: true, name: true },
    group: { id: true, name: true },
  },
};

export let LIST_SCENE_SETTING_RELATION = {
  sceneSettingArea: {
    zone: true,
    group: true,
  },
};
