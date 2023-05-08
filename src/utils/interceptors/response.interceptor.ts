import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { map } from 'rxjs/operators';
// import { MessageBrokerService } from '../message-broker.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  // constructor(private messageBrokerService: MessageBrokerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const i18n = getI18nContextFromRequest(request);

    return next.handle().pipe(
      map(async (value) => {
        if (value?.errorCode) {
          value['messages'] = [];
          value['messages'][0] = await i18n.t(`languages.${value.errorCode}`);
        } else {
          // if (request.user) {
          //   this.messageBrokerService.emitUpdateUserLastActiveAtEvent(
          //     request.user.id,
          //   );
          // }
        }

        if (value?.language) {
          value['message'] = await i18n.t(`languages.${value.language}`);
          delete value.language;
        }

        return value;
      }),
    );
  }
}
