export enum UserStatus {
  Pending = 1,
  Active = 2,
  Deactivated = 3,
  Blocked = 4,
  Deleted = 5,
  Rejected = 6,
}

export enum UserRole {
  User = 3,
  Admin = 2,
  SuperAdmin = 1,
}

export enum UserGender {
  Male = 1,
  Female = 2,
}

export const USER_SELECT = {
  role: { id: true, name: true },
  rules: { rule: { id: true, name: true }, id: true },
};

export let USER_RELATION = {
  rules: { rule: true },
  role: true,
};
