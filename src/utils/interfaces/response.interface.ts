export interface ISuccessResponse {
  data: any;
  language: string;
}

export interface IErrorResponse {
  errorCode: string;
}

export interface IResponseErrorSuccess {
  errorCode: string;
}

export interface IResponseError {
  message: any[];
  statusName: string;
  statusCodeMsg: any;
  statusCode: string;
  module: string;
  method: string;
}
