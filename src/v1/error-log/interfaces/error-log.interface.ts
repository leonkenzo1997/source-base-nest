export interface IErrorLog {
  id?: number;

  errorId?: string;

  type?: string;

  reporter?: string;

  buildingName?: string;

  userRole?: string;

  createdAt?: Date;
}
