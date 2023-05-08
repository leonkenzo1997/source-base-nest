import { MESSAGE_CODE } from '../messages/message.response';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getI18nContextFromArgumentsHost, I18nValidationException, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Catch(I18nValidationExceptionFilter)
export class I18nExceptionFilter implements ExceptionFilter {
  async catch(exception: I18nValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const i18n = getI18nContextFromArgumentsHost(host);

    const status = exception.getStatus();
    const responseBody: any = exception.getResponse();
    
    let messages: string = responseBody?.message
      ? responseBody.message
      : responseBody;

    let codeMsg = null;

    if (!Array.isArray(messages)) {
      if (messages?.toUpperCase() == messages) {
        codeMsg = messages;
        messages = await i18n.t(`languages.${messages}`);
      }
      // } else {
      //   await Promise.all(
      //     messages.map(async (message) => {
      //       message = await i18n.t(`languages.${message}`);
      //     }),
      //   );
      // }
    }
    // else {
    //   await Promise.all(
    //     messages.map(async (message) => {
    //       message = await i18n.t(`languages.${message}`);
    //     }),
    //   );
    // }

    const body = {
      message: Array.isArray(messages) ? messages : [messages],
      statusName: responseBody?.statusName || responseBody?.error || 'Error',
      statusCodeMsg: codeMsg,
      module: responseBody?.module || request?.route?.path,
      method: request.method || 'Unknown',
    };

    response.status(status).json(body);
  }
}
