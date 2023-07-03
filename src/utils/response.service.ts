import {
  IErrorResponse,
  ISuccessResponse,
} from './interfaces/response.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  constructor() {
    // empty
  }

  public success(
    data: any = {},
    language: string = 'SUCCESS',
  ): ISuccessResponse | IErrorResponse {
    const errorCode = data?.errorCode;
    
    if (errorCode) {
      return { errorCode };
    } else {
      if (!language) {
        language = 'SUCCESS';
      }
      return { data, language };
    }
  }

  public error(errorCode: string) {
    return {
      errorCode,
    };
  }
}
